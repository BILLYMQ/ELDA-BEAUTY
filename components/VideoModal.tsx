"use client";

import type { Video } from "@/types";

function toEmbedUrl(url: string): string | null {
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("youtube.com/embed/")) return url;
  return null;
}

export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const embedUrl = video.url ? toEmbedUrl(video.url) : null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-elda-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-elda-black shadow-elda"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : video.url ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={video.url} controls autoPlay className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-elda-cream/70">
              <span className="text-4xl">🎬</span>
              <p className="font-body text-sm">Aperçu vidéo à venir.</p>
            </div>
          )}
        </div>
        <div className="p-5 text-elda-cream">
          <span className="badge bg-elda-gold/20 text-elda-gold">{video.category}</span>
          <h3 className="mt-2 font-display text-lg font-semibold">{video.title}</h3>
          <p className="mt-1 font-body text-sm text-elda-cream/70">{video.description}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-elda-cream/90 text-elda-purple shadow"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
