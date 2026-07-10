"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ADMIN_PASSWORD, STORAGE_KEYS } from "@/lib/constants";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import ReservationsManager from "@/components/admin/ReservationsManager";
import MessagesManager from "@/components/admin/MessagesManager";
import VideosManager from "@/components/admin/VideosManager";
import HomeContentManager from "@/components/admin/HomeContentManager";

type Tab =
  | "produits"
  | "commandes"
  | "reservations"
  | "messagerie"
  | "videos"
  | "contenu";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "produits", label: "Produits", icon: "🧴" },
  { id: "commandes", label: "Commandes", icon: "🧾" },
  { id: "reservations", label: "Réservations", icon: "📅" },
  { id: "messagerie", label: "Messagerie", icon: "💬" },
  { id: "videos", label: "Vidéos", icon: "🎬" },
  { id: "contenu", label: "Contenu Accueil", icon: "🏠" },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("produits");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEYS.adminAuth);
    setAuthenticated(stored === "true");
    setCheckedAuth(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(STORAGE_KEYS.adminAuth, "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEYS.adminAuth);
    setAuthenticated(false);
    setPassword("");
  };

  if (!checkedAuth) return null;

  if (!authenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-elda-gradient px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-elda-gold/30 bg-elda-cream p-8 shadow-elda">
          <div className="mb-6 flex flex-col items-center gap-3">
            <Image
              src="/logo.png"
              alt="ELDA BEAUTY"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover shadow-elda-gold"
            />
            <h1 className="font-display text-xl font-bold text-elda-purple">
              Espace Administrateur
            </h1>
            <p className="text-center font-body text-sm text-elda-black/60">
              Veuillez saisir le mot de passe pour accéder au tableau de bord.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="input-elda"
              autoFocus
            />
            {error && <p className="font-body text-xs text-red-500">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="ELDA BEAUTY"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover shadow-elda-gold"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-elda-purple">
              Tableau de bord ELDA BEAUTY
            </h1>
            <p className="font-body text-xs text-elda-black/50">Espace administrateur</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary !px-5 !py-2 text-xs">
          Déconnexion
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-elda-gold/20 bg-white p-2 shadow-elda">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-body text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-elda-purple text-elda-cream"
                : "text-elda-purple-dark hover:bg-elda-purple/10"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "produits" && <ProductsManager />}
        {tab === "commandes" && <OrdersManager />}
        {tab === "reservations" && <ReservationsManager />}
        {tab === "messagerie" && <MessagesManager />}
        {tab === "videos" && <VideosManager />}
        {tab === "contenu" && <HomeContentManager />}
      </div>
    </div>
  );
}
