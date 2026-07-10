"use client";

import { useMemo, useState } from "react";
import { useVideos } from "@/lib/hooks";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import VideoModal from "@/components/VideoModal";
import type { Video } from "@/types";

type CategoryFilter = "Tous" | (typeof VIDEO_CATEGORIES)[number];

export default function VideosPage() {
  const { videos } = useVideos();
  const [category, setCategory] = useState<CategoryFilter>("Tous");
  const [playing, setPlaying] = useState<Video | null>(null);

  const filtered = useMemo(() => {
    const sorted = [...videos].sort((a, b) => b.createdAt - a.createdAt);
    if (category === "Tous") return sorted;
    return sorted.filter((v) => v.category === category);
  }, [videos, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="section-title">Vidéos ELDA BEAUTY</h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-elda-black/60">
          Présentations, promotions, conseils beauté et témoignages clients.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {(["Tous", ...VIDEO_CATEGORIES] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`badge border px-4 py-2 transition-colors ${
              category === c
                ? "border-elda-purple bg-elda-purple text-elda-cream"
                : "border-elda-purple/20 bg-transparent text-elda-purple hover:bg-elda-purple/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-elda-gold/30 bg-white px-6 py-14 text-center shadow-elda">
          <p className="font-display text-lg text-elda-purple">
            Aucune vidéo disponible pour cette catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <div key={v.id} className="card-elda overflow-hidden">
              <button
                type="button"
                onClick={() => setPlaying(v)}
                className="group relative block aspect-video w-full overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-elda-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-elda-cream/90 text-2xl text-elda-purple shadow-elda-gold">
                    ▶
                  </span>
                </span>
              </button>
              <div className="p-5">
                <span className="badge bg-elda-purple/10 text-elda-purple">{v.category}</span>
                <h3 className="mt-2 font-display text-base font-semibold text-elda-black">
                  {v.title}
                </h3>
                <p className="mt-1 line-clamp-2 font-body text-sm text-elda-black/60">
                  {v.description}
                </p>
                <button
                  type="button"
                  onClick={() => setPlaying(v)}
                  className="btn-gold mt-4 w-full !py-2 text-xs"
                >
                  Lecture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
