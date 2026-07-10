import type { Video } from "@/types";
import { placeholderThumbnail } from "@/lib/utils";

export const defaultVideos: Video[] = [
  {
    id: "video-1",
    title: "Découvrez la collection ELDA BEAUTY",
    description:
      "Une présentation élégante de notre collection de parfums haut de gamme.",
    category: "Présentation",
    thumbnail: placeholderThumbnail("Présentation", "#2E0F42", "#C9A24B"),
    url: "",
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: "video-2",
    title: "Offre spéciale ELDA BEAUTY",
    description: "Ne manquez pas nos promotions exclusives sur une sélection de fragrances.",
    category: "Promotion",
    thumbnail: placeholderThumbnail("Promotion", "#4B1D6B", "#E4C878"),
    url: "",
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: "video-3",
    title: "Comment bien choisir son parfum",
    description: "Nos conseils d'experts pour trouver la fragrance qui vous ressemble.",
    category: "Conseils",
    thumbnail: placeholderThumbnail("Conseils", "#6B2E94", "#C9A24B"),
    url: "",
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: "video-4",
    title: "Ils parlent de nous",
    description: "Nos clientes et clients partagent leur expérience ELDA BEAUTY.",
    category: "Témoignages",
    thumbnail: placeholderThumbnail("Témoignages", "#2E0F42", "#6B2E94"),
    url: "",
    createdAt: Date.now() - 1 * 86400000,
  },
];
