"use client";

import { useState } from "react";
import { useConversations } from "@/lib/hooks";
import { appendMessage, deleteConversation, setConversationStatus } from "@/lib/dataStore";
import { useToast } from "@/lib/ToastContext";
import { formatDate, generateId } from "@/lib/utils";
import type { Message } from "@/types";

export default function MessagesManager() {
  const { conversations } = useConversations();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const sorted = [...conversations].sort((a, b) => b.lastUpdated - a.lastUpdated);
  const selected = sorted.find((c) => c.id === selectedId) || null;

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    const message: Message = {
      id: generateId(),
      sender: "admin",
      text: reply.trim(),
      timestamp: Date.now(),
    };
    appendMessage(selected.id, {
      clientId: selected.clientId,
      clientName: selected.clientName,
      topic: selected.topic,
    }, message);
    setReply("");
    showToast("Réponse envoyée.", "success");
  };

  const markProcessed = (id: string) => {
    setConversationStatus(id, "traitée");
    showToast("Conversation marquée comme traitée.", "success");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette conversation ?")) return;
    deleteConversation(id);
    if (selectedId === id) setSelectedId(null);
    showToast("Conversation supprimée.", "info");
  };

  return (
    <div>
      <h2 className="mb-5 font-display text-lg font-semibold text-elda-purple-dark">
        Messagerie ({conversations.length})
      </h2>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
          <p className="font-body text-sm text-elda-black/60">Aucun message reçu pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-5 overflow-hidden rounded-2xl border border-elda-gold/20 bg-white shadow-elda md:grid-cols-[300px_1fr]">
          <div className="max-h-[560px] overflow-y-auto border-r border-elda-gold/20">
            {sorted.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full flex-col gap-1 border-b border-elda-gold/10 px-4 py-3 text-left ${
                  selectedId === c.id ? "bg-elda-purple/10" : "hover:bg-elda-purple/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-elda-purple-dark">
                    {c.clientName}
                  </span>
                  <span
                    className={`badge text-[10px] ${
                      c.status === "ouverte"
                        ? "bg-green-100 text-green-700"
                        : "bg-elda-black/10 text-elda-black/60"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <span className="font-body text-xs text-elda-black/50">{c.topic}</span>
                <span className="line-clamp-1 font-body text-xs text-elda-black/40">
                  {c.messages[c.messages.length - 1]?.text || "—"}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col p-4">
            {!selected ? (
              <p className="m-auto font-body text-sm text-elda-black/40">
                Sélectionnez une conversation pour l&apos;afficher.
              </p>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-elda-gold/10 pb-3">
                  <div>
                    <p className="font-display text-sm font-semibold text-elda-black">
                      {selected.clientName} — {selected.topic}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => markProcessed(selected.id)}
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                    >
                      Marquer comme traitée
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selected.id)}
                      className="rounded-full border-2 border-red-400 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-400 hover:text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="max-h-80 flex-1 space-y-2 overflow-y-auto">
                  {selected.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          m.sender === "admin"
                            ? "rounded-br-sm bg-elda-purple text-elda-cream"
                            : "rounded-bl-sm bg-elda-beige text-elda-black"
                        }`}
                      >
                        {m.attachment && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.attachment} alt="pièce jointe" className="mb-1 max-h-32 rounded-lg" />
                        )}
                        {m.text && <p>{m.text}</p>}
                        <p className="mt-1 text-right text-[10px] opacity-60">{formatDate(m.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleReply} className="mt-3 flex gap-2 border-t border-elda-gold/10 pt-3">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Répondre au client..."
                    className="input-elda flex-1"
                  />
                  <button type="submit" className="btn-primary !px-5 !py-2 text-sm">
                    Envoyer
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
