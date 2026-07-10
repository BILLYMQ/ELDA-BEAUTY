"use client";

import { useReservations } from "@/lib/hooks";
import { deleteReservation, updateReservationStatus } from "@/lib/dataStore";
import { useToast } from "@/lib/ToastContext";
import { formatDate } from "@/lib/utils";
import type { ReservationStatus } from "@/types";

const STATUS_STYLES: Record<ReservationStatus, string> = {
  "En attente": "bg-yellow-100 text-yellow-700",
  Acceptée: "bg-green-100 text-green-700",
  Refusée: "bg-red-100 text-red-700",
  Traitée: "bg-elda-purple/10 text-elda-purple",
};

export default function ReservationsManager() {
  const { reservations } = useReservations();
  const { showToast } = useToast();

  const sorted = [...reservations].sort((a, b) => b.createdAt - a.createdAt);

  const updateStatus = (id: string, status: ReservationStatus) => {
    updateReservationStatus(id, status);
    showToast("Statut de la réservation mis à jour.", "success");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette réservation ?")) return;
    deleteReservation(id);
    showToast("Réservation supprimée.", "info");
  };

  return (
    <div>
      <h2 className="mb-5 font-display text-lg font-semibold text-elda-purple-dark">
        Réservations ({reservations.length})
      </h2>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
          <p className="font-body text-sm text-elda-black/60">Aucune réservation pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((r) => (
            <div key={r.id} className="rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-sm font-semibold text-elda-black">
                    {r.customerName}
                  </p>
                  <p className="font-body text-xs text-elda-black/50">
                    {r.phone} · {r.email}
                  </p>
                  <p className="mt-1 font-body text-sm text-elda-black/70">
                    {r.productName} — Quantité : {r.quantity}
                  </p>
                  <p className="font-body text-xs text-elda-black/50">
                    Date souhaitée : {r.desiredDate}
                  </p>
                  {r.message && (
                    <p className="mt-1 font-body text-xs italic text-elda-black/50">{r.message}</p>
                  )}
                  <p className="mt-1 font-body text-[11px] text-elda-black/40">
                    {formatDate(r.createdAt)}
                  </p>
                </div>
                <span className={`badge ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-elda-gold/10 pt-3">
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, "Acceptée")}
                  className="btn-gold !px-4 !py-1.5 text-xs"
                >
                  Accepter
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, "Refusée")}
                  className="rounded-full border-2 border-red-400 px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-400 hover:text-white"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(r.id, "Traitée")}
                  className="btn-secondary !px-4 !py-1.5 text-xs"
                >
                  Marquer comme traitée
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="ml-auto rounded-full border-2 border-elda-black/20 px-4 py-1.5 text-xs font-semibold text-elda-black/60 transition-colors hover:bg-elda-black/10"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
