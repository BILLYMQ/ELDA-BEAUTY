import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import { ToastProvider } from "@/lib/ToastContext";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ELDA BEAUTY — Révélez votre éclat naturel",
  description:
    "ELDA BEAUTY, maison de parfumerie de luxe. Découvrez notre collection de parfums d'exception pour Femme, Homme et Mixte.",
  openGraph: {
    title: "ELDA BEAUTY — Révélez votre éclat naturel",
    description:
      "ELDA BEAUTY, maison de parfumerie de luxe. Découvrez notre collection de parfums d'exception pour Femme, Homme et Mixte.",
    url: SITE_URL,
    siteName: "ELDA BEAUTY",
    images: [{ url: "/logo-512.png", width: 512, height: 512 }],
    locale: "fr_FR",
    type: "website",
  },
};

// Structured data (schema.org Organization) so Google can associate this
// logo with the site — e.g. in the Knowledge Panel / brand search results.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ELDA BEAUTY",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-512.png`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-elda-cream font-body">
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
