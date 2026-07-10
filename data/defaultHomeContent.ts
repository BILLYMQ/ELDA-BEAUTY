import type { HomeContent } from "@/types";

export const defaultHomeContent: HomeContent = {
  heroSlogan: "Révélez votre éclat naturel avec ELDA BEAUTY",
  heroSubtext:
    "Une collection de parfums d'exception, pensée pour sublimer chaque instant de votre vie avec élégance et raffinement.",
  ctaTitle: "Trouvez le parfum qui révèle votre personnalité.",
  ctaText:
    "Explorez notre collection et laissez-vous guider vers la fragrance qui vous ressemble.",
  whyChooseUs: [
    {
      id: "wcu-1",
      icon: "✨",
      title: "Qualité premium",
      description:
        "Des fragrances sélectionnées avec exigence pour une expérience olfactive raffinée.",
    },
    {
      id: "wcu-2",
      icon: "🌿",
      title: "Ingrédients nobles",
      description:
        "Des essences soigneusement choisies pour révéler votre éclat naturel.",
    },
    {
      id: "wcu-3",
      icon: "🚚",
      title: "Livraison soignée",
      description:
        "Chaque commande est préparée et expédiée avec le plus grand soin.",
    },
    {
      id: "wcu-4",
      icon: "💬",
      title: "Service dédié",
      description:
        "Notre équipe vous accompagne pour trouver le parfum qui vous correspond.",
    },
  ],
  testimonials: [
    {
      id: "t-1",
      name: "Aïcha K.",
      text: "Un service exceptionnel et des parfums d'une élégance rare. ELDA BEAUTY est devenu mon adresse incontournable.",
      rating: 5,
    },
    {
      id: "t-2",
      name: "Moussa D.",
      text: "La qualité est vraiment au rendez-vous, on sent le raffinement dès le premier contact.",
      rating: 5,
    },
    {
      id: "t-3",
      name: "Fatou S.",
      text: "Une expérience client soignée du début à la fin. Je recommande vivement.",
      rating: 4,
    },
  ],
  featuredProductIds: [],
  shippingFee: undefined,
};
