"use client";

import { useOrders } from "@/lib/hooks";
import { deleteOrder, updateOrderStatus } from "@/lib/dataStore";
import { useToast } from "@/lib/ToastContext";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export default function OrdersManager() {
  const { orders } = useOrders();
  const { showToast } = useToast();

  const sorted = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const updateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    showToast("Statut de la commande mis à jour.", "success");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    deleteOrder(id);
    showToast("Commande supprimée.", "info");
  };

  return (
    <div>
      <h2 className="mb-5 font-display text-lg font-semibold text-elda-purple-dark">
        Commandes ({orders.length})
      </h2>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
          <p className="font-body text-sm text-elda-black/60">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((order) => (
            <div key={order.id} className="rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-sm font-semibold text-elda-black">
                    {order.customerName}
                  </p>
                  <p className="font-body text-xs text-elda-black/50">
                    {order.phone} · {order.email}
                  </p>
                  <p className="font-body text-xs text-elda-black/50">{order.address}</p>
                  <p className="mt-1 font-body text-[11px] text-elda-black/40">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  className="input-elda !w-auto"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 space-y-1 border-t border-elda-gold/10 pt-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between font-body text-sm text-elda-black/70">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {order.message && (
                <p className="mt-2 font-body text-xs italic text-elda-black/50">
                  Message : {order.message}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-elda-gold/10 pt-3">
                <p className="font-display text-sm font-semibold text-elda-gold-dark">
                  Total :{" "}
                  {order.hasUnpricedItems
                    ? "Prix à confirmer avec ELDA BEAUTY."
                    : formatPrice(order.total)}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(order.id)}
                  className="rounded-full border-2 border-red-400 px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-400 hover:text-white"
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
