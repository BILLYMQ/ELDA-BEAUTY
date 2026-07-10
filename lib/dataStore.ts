import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebaseClient";
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

export { isFirebaseConfigured };

type Unsubscribe = () => void;

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Firestore rejects `undefined` field values outright (unlike JSON.stringify,
 * which silently drops them). Our types use optional fields (price?, quantity?...)
 * that are commonly left unset, so every write to Firestore must be sanitized first.
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

/**
 * For updateDoc() patches specifically: an explicit `undefined` means "clear this
 * field" (e.g. admin empties the price input), so it must become deleteField()
 * rather than being silently omitted (which would leave the old value untouched).
 */
function sanitizeForUpdate(patch: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(patch)) {
    result[key] = v === undefined ? deleteField() : stripUndefined(v);
  }
  return result;
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
 * Factory for a simple collection (id + createdAt) backed either by Firestore
 * (when Firebase env vars are configured) or localStorage (offline fallback).
 * Same interface either way so components never need to know which backend is live.
 */
function createCollectionStore<T extends { id: string; createdAt: number }>(
  storageKey: string,
  collectionName: string
) {
  function localReadAll(): T[] {
    return [...readLocal<T[]>(storageKey, [])].sort((a, b) => b.createdAt - a.createdAt);
  }

  function subscribe(cb: (items: T[]) => void): Unsubscribe {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
      return onSnapshot(q, (snap) => {
        cb(snap.docs.map((d) => d.data() as T));
      });
    }
    cb(localReadAll());
    return onLocalChange(storageKey, () => cb(localReadAll()));
  }

  async function add(item: T): Promise<void> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, collectionName, item.id), stripUndefined(item));
      return;
    }
    writeLocal(storageKey, [item, ...readLocal<T[]>(storageKey, [])]);
  }

  async function update(id: string, patch: Partial<T>): Promise<void> {
    if (isFirebaseConfigured && db) {
      await updateDoc(
        doc(db, collectionName, id),
        sanitizeForUpdate(patch as Record<string, unknown>)
      );
      return;
    }
    writeLocal(
      storageKey,
      readLocal<T[]>(storageKey, []).map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  }

  async function remove(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, collectionName, id));
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
  if (isFirebaseConfigured && db) {
    const snap = await getDocs(collection(db, "videos"));
    if (snap.empty) {
      await Promise.all(
        defaultVideos.map((v) => setDoc(doc(db!, "videos", v.id), stripUndefined(v)))
      );
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

export function subscribeConversations(cb: (list: Conversation[]) => void): Unsubscribe {
  if (isFirebaseConfigured && db) {
    return onSnapshot(collection(db, "conversations"), (snap) => {
      cb(snap.docs.map((d) => d.data() as Conversation));
    });
  }
  cb(localReadConversations());
  return onLocalChange(STORAGE_KEYS.conversations, () => cb(localReadConversations()));
}

export async function appendMessage(
  conversationId: string,
  base: { clientId: string; clientName: string; topic: ConversationTopic },
  message: Message
): Promise<void> {
  if (isFirebaseConfigured && db) {
    // A single merged setDoc + arrayUnion is atomic server-side, whether the
    // document already exists or not — avoids a getDoc-then-branch race where
    // two near-simultaneous appends (e.g. the client message and the 1.2s-later
    // auto-reply) could both see "not found" and overwrite each other.
    const ref = doc(db, "conversations", conversationId);
    await setDoc(
      ref,
      {
        id: conversationId,
        clientId: base.clientId,
        clientName: base.clientName,
        topic: base.topic,
        status: "ouverte",
        lastUpdated: Date.now(),
        messages: arrayUnion(stripUndefined(message)),
      },
      { merge: true }
    );
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
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, "conversations", id), { status });
    return;
  }
  localWriteConversations(
    localReadConversations().map((c) => (c.id === id ? { ...c, status } : c))
  );
}

export async function deleteConversation(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, "conversations", id));
    return;
  }
  localWriteConversations(localReadConversations().filter((c) => c.id !== id));
}

// CONTENU PAGE D'ACCUEIL (document unique)
const HOME_CONTENT_DOC_ID = "main";

export function subscribeHomeContent(cb: (content: HomeContent) => void): Unsubscribe {
  if (isFirebaseConfigured && db) {
    const ref = doc(db, "homeContent", HOME_CONTENT_DOC_ID);
    let unsub = () => {};
    getDoc(ref).then((snap) => {
      if (!snap.exists()) {
        setDoc(ref, stripUndefined(defaultHomeContent));
      }
      unsub = onSnapshot(ref, (s) => {
        cb(s.exists() ? (s.data() as HomeContent) : defaultHomeContent);
      });
    });
    return () => unsub();
  }
  cb(readLocal<HomeContent>(STORAGE_KEYS.homeContent, defaultHomeContent));
  return onLocalChange(STORAGE_KEYS.homeContent, () =>
    cb(readLocal<HomeContent>(STORAGE_KEYS.homeContent, defaultHomeContent))
  );
}

export async function setHomeContent(content: HomeContent): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, "homeContent", HOME_CONTENT_DOC_ID), stripUndefined(content));
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
