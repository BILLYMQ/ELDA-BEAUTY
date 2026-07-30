"use client";

import { isSupabaseConfigured } from "@/lib/dataStore";

/**
 * Bannière d'avertissement affichée quand l'application tourne SANS Supabase
 * (variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absentes
 * du build). Dans ce mode, la messagerie retombe sur le stockage local du
 * navigateur : les messages restent sur l'appareil qui les a écrits et ne sont
 * JAMAIS partagés entre le client et l'administrateur.
 *
 * Sans cette bannière, le repli est totalement silencieux — le client croit
 * avoir envoyé son message alors que l'admin ne le recevra jamais.
 */
export default function MessagingConnectionNotice({
  audience,
}: {
  audience: "client" | "admin";
}) {
  if (isSupabaseConfigured) return null;

  const message =
    audience === "client"
      ? "Mode hors-ligne : la base de données n'est pas connectée. Vos messages restent sur cet appareil et ne seront pas transmis à l'administrateur."
      : "Mode hors-ligne : la base de données n'est pas connectée. Les messages des clients envoyés depuis d'autres appareils n'apparaîtront pas ici.";

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
      <span aria-hidden className="text-lg leading-none">
        ⚠️
      </span>
      <div>
        <p className="font-display text-sm font-semibold text-red-700">
          Messagerie non connectée
        </p>
        <p className="mt-0.5 font-body text-xs leading-snug text-red-600">
          {message} Configurez les variables{" "}
          <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          puis redéployez le site.
        </p>
      </div>
    </div>
  );
}
