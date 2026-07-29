import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const ROUTES = ["", "/nouveautes", "/messagerie", "/panier-reservation", "/videos"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
