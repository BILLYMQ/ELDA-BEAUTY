"use client";

import { useState } from "react";
import { useVideos } from "@/lib/hooks";
import { addVideo, deleteVideo, updateVideo } from "@/lib/dataStore";
import { useToast } from "@/lib/ToastContext";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { fileToDataUrl, generateId, placeholderThumbnail } from "@/lib/utils";
import type { Video, VideoCategory } from "@/types";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Présentation" as VideoCategory,
  thumbnail: "",
  url: "",
};

export default function VideosManager() {
  const { videos } = useVideos();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (v: Video) => {
    setEditingId(v.id);
    setForm({
      title: v.title,
      description: v.description,
      category: v.category,
      thumbnail: v.thumbnail,
      url: v.url,
    });
    setError("");
    setShowForm(true);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, thumbnail: dataUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Le titre et la description sont obligatoires.");
      return;
    }

    const thumbnail = form.thumbnail || placeholderThumbnail(form.category);

    if (editingId) {
      updateVideo(editingId, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        thumbnail,
        url: form.url.trim(),
      });
      showToast("Vidéo modifiée avec succès.", "success");
    } else {
      const newVideo: Video = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        thumbnail,
        url: form.url.trim(),
        createdAt: Date.now(),
      };
      addVideo(newVideo);
      showToast("Vidéo ajoutée avec succès.", "success");
    }

    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer cette vidéo ?")) return;
    deleteVideo(id);
    showToast("Vidéo supprimée.", "info");
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-elda-purple-dark">
          Vidéos ({videos.length})
        </h2>
        <button type="button" onClick={openAddForm} className="btn-primary !px-5 !py-2.5 text-sm">
          + Ajouter une vidéo
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda"
        >
          <h3 className="font-display text-base font-semibold text-elda-purple">
            {editingId ? "Modifier la vidéo" : "Nouvelle vidéo"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Titre"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-elda"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as VideoCategory })}
              className="input-elda"
            >
              {VIDEO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-elda min-h-[70px]"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs text-elda-black/60">Miniature</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="input-elda !py-2 text-xs" />
              {form.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.thumbnail} alt="aperçu" className="mt-2 h-16 w-28 rounded-lg object-cover" />
              )}
            </div>
            <input
              placeholder="Lien vidéo (YouTube ou MP4)"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input-elda"
            />
          </div>
          {error && <p className="font-body text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      )}

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
          <p className="font-body text-sm text-elda-black/60">Aucune vidéo pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <div key={v.id} className="rounded-xl border border-elda-gold/20 bg-white p-4 shadow-elda">
              <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-elda-beige">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
              </div>
              <span className="badge bg-elda-purple/10 text-elda-purple">{v.category}</span>
              <h3 className="mt-2 font-display text-sm font-semibold text-elda-black">{v.title}</h3>
              <p className="line-clamp-2 font-body text-xs text-elda-black/60">{v.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(v)}
                  className="btn-secondary flex-1 !px-3 !py-1.5 text-xs"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  className="flex-1 rounded-full border-2 border-red-400 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-400 hover:text-white"
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
