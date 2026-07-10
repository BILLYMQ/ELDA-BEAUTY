"use client";

import { useEffect, useState } from "react";
import {
  subscribeConversations,
  subscribeHomeContent,
  subscribeOrders,
  subscribeProducts,
  subscribeReservations,
  subscribeVideos,
  setHomeContent as setHomeContentRemote,
} from "./dataStore";
import { defaultHomeContent } from "@/data/defaultHomeContent";
import type {
  Conversation,
  HomeContent,
  Order,
  Product,
  Reservation,
  Video,
} from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => subscribeProducts(setProducts), []);
  return { products };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => subscribeOrders(setOrders), []);
  return { orders };
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => subscribeReservations(setReservations), []);
  return { reservations };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  useEffect(() => subscribeConversations(setConversations), []);
  return { conversations };
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => subscribeVideos(setVideos), []);
  return { videos };
}

export function useHomeContent() {
  const [homeContent, setHomeContentState] = useState<HomeContent>(defaultHomeContent);
  useEffect(() => subscribeHomeContent(setHomeContentState), []);

  const setHomeContent = (content: HomeContent) => {
    setHomeContentState(content);
    void setHomeContentRemote(content);
  };

  return { homeContent, setHomeContent };
}
