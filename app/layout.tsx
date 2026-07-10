import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import { ToastProvider } from "@/lib/ToastContext";

export const metadata: Metadata = {
  title: "ELDA BEAUTY — Révélez votre éclat naturel",
  description:
    "ELDA BEAUTY, maison de parfumerie de luxe. Découvrez notre collection de parfums d'exception pour Femme, Homme et Mixte.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
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
