export const ADMIN_PASSWORD = "yanik123";

export const STORAGE_KEYS = {
  products: "elda_products",
  cart: "elda_cart",
  orders: "elda_orders",
  reservations: "elda_reservations",
  conversations: "elda_conversations",
  videos: "elda_videos",
  homeContent: "elda_home_content",
  clientId: "elda_client_id",
  adminAuth: "elda_admin_auth",
} as const;

export const EVENT_PREFIX = "elda:update:";

export const CATEGORIES: Array<"Femme" | "Homme" | "Mixte"> = [
  "Femme",
  "Homme",
  "Mixte",
];

export const ORDER_STATUSES = [
  "En attente",
  "Confirmée",
  "Payée",
  "En livraison",
  "Livrée",
  "Annulée",
] as const;

export const RESERVATION_STATUSES = [
  "En attente",
  "Acceptée",
  "Refusée",
  "Traitée",
] as const;

export const VIDEO_CATEGORIES = [
  "Présentation",
  "Promotion",
  "Conseils",
  "Témoignages",
] as const;

export const CONVERSATION_TOPICS = ["Général", "Commandes", "Réservations"] as const;

export const AUTO_REPLY_TEXT =
  "Merci pour votre message. ELDA BEAUTY vous répondra rapidement.";
