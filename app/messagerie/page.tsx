"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useConversations } from "@/lib/hooks";
import { appendMessage, getClientId } from "@/lib/dataStore";
import { AUTO_REPLY_TEXT, CONVERSATION_TOPICS } from "@/lib/constants";
import { generateId, formatDate, fileToDataUrl } from "@/lib/utils";
import type { ConversationTopic, Message } from "@/types";

const QUICK_ACTIONS: { label: string; topic: ConversationTopic; prefill: string }[] = [
  {
    label: "Demander un parfum",
    topic: "Général",
    prefill: "Je souhaite demander des informations sur un parfum.",
  },
  {
    label: "Suivre ma commande",
    topic: "Commandes",
    prefill: "Je souhaite suivre ma commande.",
  },
  {
    label: "Réserver un parfum",
    topic: "Réservations",
    prefill: "Je souhaite réserver un parfum.",
  },
];

export default function MessageriePage() {
  const { conversations } = useConversations();
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("Vous");
  const [activeTopic, setActiveTopic] = useState<ConversationTopic>("Général");
  const [text, setText] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClientId(getClientId());
    const savedName = window.localStorage.getItem("elda_client_name");
    if (savedName) setClientName(savedName);
  }, []);

  const myConversations = useMemo(
    () => conversations.filter((c) => c.clientId === clientId),
    [conversations, clientId]
  );

  const activeConversation = useMemo(
    () => myConversations.find((c) => c.topic === activeTopic) || null,
    [myConversations, activeTopic]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeConversation?.messages.length, activeTopic]);

  const persistName = (name: string) => {
    setClientName(name);
    window.localStorage.setItem("elda_client_name", name);
  };

  const sendMessage = (rawText: string, attachment?: string) => {
    const trimmed = rawText.trim();
    if (!trimmed && !attachment) return;
    if (!clientId) return;

    const conversationId = `${clientId}::${activeTopic}`;
    const message: Message = {
      id: generateId(),
      sender: "client",
      text: trimmed,
      timestamp: Date.now(),
      attachment,
    };
    appendMessage(conversationId, { clientId, clientName, topic: activeTopic }, message);
    setText("");

    setTimeout(() => {
      const autoReply: Message = {
        id: generateId(),
        sender: "admin",
        text: AUTO_REPLY_TEXT,
        timestamp: Date.now(),
      };
      appendMessage(conversationId, { clientId, clientName, topic: activeTopic }, autoReply);
    }, 1200);
  };

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    sendMessage(`📎 ${file.name}`, dataUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleQuickAction = (topic: ConversationTopic, prefill: string) => {
    setActiveTopic(topic);
    setText(prefill);
    setMobileShowChat(true);
  };

  const lastMessagePreview = (topic: ConversationTopic) => {
    const conv = myConversations.find((c) => c.topic === topic);
    if (!conv || conv.messages.length === 0) return "Aucun message pour l'instant";
    return conv.messages[conv.messages.length - 1].text || "📎 Pièce jointe";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h1 className="section-title">Messagerie</h1>
        <p className="mt-2 font-body text-sm text-elda-black/60">
          Discutez directement avec l&apos;équipe ELDA BEAUTY.
        </p>
      </div>

      <div className="grid overflow-hidden rounded-2xl border border-elda-gold/20 bg-white shadow-elda md:grid-cols-[300px_1fr]">
        <aside
          className={`flex-col border-r border-elda-gold/20 bg-elda-beige/40 md:flex ${
            mobileShowChat ? "hidden" : "flex"
          }`}
        >
          <div className="border-b border-elda-gold/20 p-4">
            <label className="mb-1 block font-body text-xs font-semibold text-elda-purple">
              Votre nom
            </label>
            <input
              value={clientName}
              onChange={(e) => persistName(e.target.value)}
              className="input-elda !py-2 text-sm"
              placeholder="Votre nom"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATION_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setActiveTopic(topic);
                  setMobileShowChat(true);
                }}
                className={`flex w-full flex-col gap-1 border-b border-elda-gold/10 px-4 py-3 text-left transition-colors ${
                  activeTopic === topic ? "bg-elda-purple/10" : "hover:bg-elda-purple/5"
                }`}
              >
                <span className="font-display text-sm font-semibold text-elda-purple-dark">
                  {topic}
                </span>
                <span className="line-clamp-1 font-body text-xs text-elda-black/50">
                  {lastMessagePreview(topic)}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className={`flex flex-col ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
          <div className="flex items-center justify-between border-b border-elda-gold/20 bg-elda-purple px-4 py-3 text-elda-cream">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileShowChat(false)}
                className="text-elda-cream md:hidden"
                aria-label="Retour"
              >
                ←
              </button>
              <div>
                <p className="font-display text-sm font-semibold">ELDA BEAUTY — {activeTopic}</p>
                <p className="flex items-center gap-1.5 font-body text-xs text-elda-cream/70">
                  <span className="h-2 w-2 rounded-full bg-green-400" /> En ligne
                </p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-elda-cream/60 p-4" style={{ minHeight: 360, maxHeight: 480 }}>
            {!activeConversation || activeConversation.messages.length === 0 ? (
              <p className="mt-10 text-center font-body text-sm text-elda-black/40">
                Envoyez votre premier message à ELDA BEAUTY.
              </p>
            ) : (
              activeConversation.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      m.sender === "client"
                        ? "rounded-br-sm bg-elda-purple text-elda-cream"
                        : "rounded-bl-sm bg-white text-elda-black"
                    }`}
                  >
                    {m.attachment && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.attachment} alt="pièce jointe" className="mb-1 max-h-40 rounded-lg" />
                    )}
                    {m.text && <p className="font-body text-sm">{m.text}</p>}
                    <p className="mt-1 text-right font-body text-[10px] opacity-60">
                      {formatDate(m.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-elda-gold/20 p-3">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.label}
                type="button"
                onClick={() => handleQuickAction(qa.topic, qa.prefill)}
                className="badge border border-elda-gold/40 bg-elda-gold/10 px-3 py-1.5 text-elda-gold-dark hover:bg-elda-gold/20"
              >
                {qa.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(text);
            }}
            className="flex items-center gap-2 border-t border-elda-gold/20 p-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAttachment}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-elda-gold/30 text-elda-purple hover:bg-elda-purple/10"
              aria-label="Joindre un fichier"
            >
              📎
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez votre message..."
              className="input-elda flex-1"
            />
            <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm">
              Envoyer
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
