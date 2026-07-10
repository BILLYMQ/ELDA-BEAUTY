export type ProductCategory = "Femme" | "Homme" | "Mixte";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price?: number;
  available: boolean;
  isNew: boolean;
  quantity?: number;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  category: ProductCategory;
  price?: number;
  quantity: number;
}

export type OrderStatus =
  | "En attente"
  | "Confirmée"
  | "Payée"
  | "En livraison"
  | "Livrée"
  | "Annulée";

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  email: string;
  address: string;
  message?: string;
  subtotal?: number;
  shipping?: number;
  total?: number;
  hasUnpricedItems: boolean;
  status: OrderStatus;
  createdAt: number;
}

export type ReservationStatus = "En attente" | "Acceptée" | "Refusée" | "Traitée";

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  productId: string;
  productName: string;
  quantity: number;
  desiredDate: string;
  message?: string;
  status: ReservationStatus;
  createdAt: number;
}

export type MessageSender = "client" | "admin";

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  attachment?: string;
}

export type ConversationTopic = "Général" | "Commandes" | "Réservations";
export type ConversationStatus = "ouverte" | "traitée";

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  topic: ConversationTopic;
  messages: Message[];
  status: ConversationStatus;
  lastUpdated: number;
}

export type VideoCategory =
  | "Présentation"
  | "Promotion"
  | "Conseils"
  | "Témoignages";

export interface Video {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnail: string;
  url: string;
  createdAt: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface WhyChooseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  heroSlogan: string;
  heroSubtext: string;
  ctaTitle: string;
  ctaText: string;
  whyChooseUs: WhyChooseItem[];
  testimonials: Testimonial[];
  featuredProductIds: string[];
  shippingFee?: number;
}
