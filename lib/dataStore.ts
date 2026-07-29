import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { EVENT_PREFIX, STORAGE_KEYS } from "./constants";
import { defaultHomeContent } from "@/data/defaultHomeContent";
import { defaultVideos } from "@/data/defaultVideos";
import type {
  Conversation,
  ConversationStatus,
  ConversationTopic,
  HomeContent,
  Message,
  Order,
  OrderStatus,
  Product,
  Reservation,
  ReservationStatus,
  Video,
} from "@/types";

export { isSupabaseConfigured };

type Unsubscribe = () => void;

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * The Supabase JS client JSON-serializes payloads before sending them, which
 * silently drops `undefined`-valued keys (unlike leaving them in and hoping
 * Postgres ignores them). Our types use optional fields (price?, quantity?...)
 * that are commonly left unset, and an explicit `undefined` means "clear this
 * field" (e.g. admin empties the price input) — stripping it here makes that
 * intent explicit instead of relying on implicit serializer behavior.
 */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      result[key] = stripUndefined(v);
    }
    return result as T;
  }
  return value;
}

function readLocal<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}${key}`));
}

function onLocalChange(key: string, cb: () => void): Unsubscribe {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(`${EVENT_PREFIX}${key}`, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(`${EVENT_PREFIX}${key}`, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Factory for a simple collection (id + createdAt) backed either by Supabase
 * (when env vars are configured) or localStorage (offline fallback). Same
 * interface either way so components never need to know which backend is live.
 *
 * Each row is `{ id, created_at, data }` where `data` is the full JS object —
 * this mirrors the previous Firestore document model and keeps optional/nested
 * fields (arrays, sub-objects) working without a bespoke column per field.
 */
function createCollectionStore<T extends { id: string; createdAt: number }>(
  storageKey: string,
  tableName: string
) {
  function localReadAll(): T[] {
    return [...readLocal<T[]>(storageKey, [])].sort((a, b) => b.createdAt - a.createdAt);
  }

  async function fetchAll(): Promise<T[]> {
    const { data, error } = await supabase!
      .from(tableName)
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => row.data as T);
  }

  function subscribe(cb: (items: T[]) => void): Unsubscribe {
    if (isSupabaseConfigured && supabase) {
      let cancelled = false;
      const refresh = () => {
        fetchAll().then((items) => {
          if (!cancelled) cb(items);
        });
      };
      refresh();
      const client = supabase;
      const channel = client
        .channel(`${tableName}-changes`)
        .on("postgres_changes", { event: "*", schema: "public", table: tableName }, refresh)
        .subscribe();
      return () => {
        cancelled = true;
        client.removeChannel(channel);
      };
    }
    cb(localReadAll());
    return onLocalChange(storageKey, () => cb(localReadAll()));
  }

  async function add(item: T): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(tableName)
        .upsert({ id: item.id, created_at: item.createdAt, data: stripUndefined(item) });
      if (error) throw error;
      return;
    }
    writeLocal(storageKey, [item, ...readLocal<T[]>(storageKey, [])]);
  }

  async function update(id: string, patch: Partial<T>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: existing, error: fetchError } = await supabase
        .from(tableName)
        .select("data")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;
      const merged = stripUndefined({ ...(existing.data as object), ...patch });
      const { error } = await supabase.from(tableName).update({ data: merged }).eq("id", id);
      if (error) throw error;
      return;
    }
    writeLocal(
      storageKey,
      readLocal<T[]>(storageKey, []).map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  }

  async function remove(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      return;
    }
    writeLocal(
      storageKey,
      readLocal<T[]>(storageKey, []).filter((i) => i.id !== id)
    );
  }

  return { subscribe, add, update, remove };
}

// PRODUITS
const productsStore = createCollectionStore<Product>(STORAGE_KEYS.products, "products");
export const subscribeProducts = productsStore.subscribe;
export const addProduct = productsStore.add;
export const updateProduct = productsStore.update;
export const deleteProduct = productsStore.remove;

// COMMANDES
const ordersStore = createCollectionStore<Order>(STORAGE_KEYS.orders, "orders");
export const subscribeOrders = ordersStore.subscribe;
export const addOrder = ordersStore.add;
export const deleteOrder = ordersStore.remove;
export function updateOrderStatus(id: string, status: OrderStatus) {
  return ordersStore.update(id, { status } as Partial<Order>);
}

// RÉSERVATIONS
const reservationsStore = createCollectionStore<Reservation>(
  STORAGE_KEYS.reservations,
  "reservations"
);
export const subscribeReservations = reservationsStore.subscribe;
export const addReservation = reservationsStore.add;
export const deleteReservation = reservationsStore.remove;
export function updateReservationStatus(id: string, status: ReservationStatus) {
  return reservationsStore.update(id, { status } as Partial<Reservation>);
}

// VIDÉOS (avec placeholders par défaut au premier chargement)
const videosStore = createCollectionStore<Video>(STORAGE_KEYS.videos, "videos");

async function seedVideosIfEmpty() {
  if (isSupabaseConfigured && supabase) {
    const { count, error } = await supabase
      .from("videos")
      .select("id", { count: "exact", head: true });
    if (!error && !count) {
      const rows = defaultVideos.map((v) => ({
        id: v.id,
        created_at: v.createdAt,
        data: stripUndefined(v),
      }));
      await supabase.from("videos").upsert(rows);
    }
    return;
  }
  if (isBrowser() && window.localStorage.getItem(STORAGE_KEYS.videos) === null) {
    writeLocal(STORAGE_KEYS.videos, defaultVideos);
  }
}

export function subscribeVideos(cb: (videos: Video[]) => void): Unsubscribe {
  let unsub: Unsubscribe = () => {};
  seedVideosIfEmpty().finally(() => {
    unsub = videosStore.subscribe(cb);
  });
  return () => unsub();
}
export const addVideo = videosStore.add;
export const updateVideo = videosStore.update;
export const deleteVideo = videosStore.remove;

// CONVERSATIONS (messagerie)
function localReadConversations(): Conversation[] {
  return readLocal<Conversation[]>(STORAGE_KEYS.conversations, []);
}

function localWriteConversations(list: Conversation[]) {
  writeLocal(STORAGE_KEYS.conversations, list);
}

async function fetchConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase!
    .from("conversations")
    .select("data")
    .order("last_updated", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.data as Conversation);
}

export function subscribeConversations(cb: (list: Conversation[]) => void): Unsubscribe {
  if (isSupabaseConfigured && supabase) {
    let cancelled = false;
    const refresh = () => {
      fetchConversations().then((items) => {
        if (!cancelled) cb(items);
      });
    };
    refresh();
    const client = supabase;
    const channel = client
      .channel("conversations-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, refresh)
      .subscribe();
    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }
  cb(localReadConversations());
  return onLocalChange(STORAGE_KEYS.conversations, () => cb(localReadConversations()));
}

export async function appendMessage(
  conversationId: string,
  base: { clientId: string; clientName: string; topic: ConversationTopic },
  message: Message
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("data")
      .eq("id", conversationId)
      .maybeSingle();
    if (fetchError) throw fetchError;
    const now = Date.now();
    const existingConv = existing?.data as Conversation | undefined;
    const next: Conversation = existingConv
      ? {
          ...existingConv,
          clientName: base.clientName,
          messages: [...existingConv.messages, message],
          status: "ouverte",
          lastUpdated: now,
        }
      : {
          id: conversationId,
          clientId: base.clientId,
          clientName: base.clientName,
          topic: base.topic,
          messages: [message],
          status: "ouverte",
          lastUpdated: now,
        };
    const { error } = await supabase
      .from("conversations")
      .upsert({ id: conversationId, last_updated: now, data: stripUndefined(next) });
    if (error) throw error;
    return;
  }

  const all = localReadConversations();
  const idx = all.findIndex((c) => c.id === conversationId);
  if (idx === -1) {
    all.push({
      id: conversationId,
      clientId: base.clientId,
      clientName: base.clientName,
      topic: base.topic,
      messages: [message],
      status: "ouverte",
      lastUpdated: Date.now(),
    });
  } else {
    all[idx] = {
      ...all[idx],
      clientName: base.clientName,
      messages: [...all[idx].messages, message],
      status: "ouverte",
      lastUpdated: Date.now(),
    };
  }
  localWriteConversations(all);
}

export async function setConversationStatus(
  id: string,
  status: ConversationStatus
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("data")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;
    const next = { ...(existing.data as Conversation), status };
    const { error } = await supabase.from("conversations").update({ data: next }).eq("id", id);
    if (error) throw error;
    return;
  }
  localWriteConversations(
    localReadConversations().map((c) => (c.id === id ? { ...c, status } : c))
  );
}

export async function deleteConversation(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  localWriteConversations(localReadConversations().filter((c) => c.id !== id));
}

// CONTENU PAGE D'ACCUEIL (document unique)
const HOME_CONTENT_ID = "main";

export function subscribeHomeContent(cb: (content: HomeContent) => void): Unsubscribe {
  if (isSupabaseConfigured && supabase) {
    let cancelled = false;
    const refresh = async () => {
      const { data, error } = await supabase!
        .from("home_content")
        .select("data")
        .eq("id", HOME_CONTENT_ID)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        cb(data.data as HomeContent);
        return;
      }
      await supabase!
        .from("home_content")
        .upsert({ id: HOME_CONTENT_ID, data: stripUndefined(defaultHomeContent) });
      if (!cancelled) cb(defaultHomeContent);
    };
    refresh();
    const client = supabase;
    const channel = client
      .channel("home-content-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "home_content", filter: `id=eq.${HOME_CONTENT_ID}` },
        refresh
      )
      .subscribe();
    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }
  cb(readLocal<HomeContent>(STORAGE_KEYS.homeContent, defaultHomeContent));
  return onLocalChange(STORAGE_KEYS.homeContent, () =>
    cb(readLocal<HomeContent>(STORAGE_KEYS.homeContent, defaultHomeContent))
  );
}

export async function setHomeContent(content: HomeContent): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("home_content")
      .upsert({ id: HOME_CONTENT_ID, data: stripUndefined(content) });
    if (error) throw error;
    return;
  }
  writeLocal(STORAGE_KEYS.homeContent, content);
}

// Identifiant client (visiteur) — reste local à l'appareil, comme un panier.
export function getClientId(): string {
  if (!isBrowser()) return "";
  let id = window.localStorage.getItem(STORAGE_KEYS.clientId);
  if (!id) {
    id = `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(STORAGE_KEYS.clientId, id);
  }
  return id;
}
