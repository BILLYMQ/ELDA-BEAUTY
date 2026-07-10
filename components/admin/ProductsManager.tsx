"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks";
import { addProduct, deleteProduct, updateProduct } from "@/lib/dataStore";
import { CATEGORIES } from "@/lib/constants";
import { fileToDataUrl, formatPrice, generateId } from "@/lib/utils";
import { useToast } from "@/lib/ToastContext";
import type { Product, ProductCategory } from "@/types";

const EMPTY_FORM = {
  name: "",
  category: "Femme" as ProductCategory,
  description: "",
  image: "",
  price: "",
  available: true,
  isNew: false,
  quantity: "",
};

export default function ProductsManager() {
  const { products } = useProducts();
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

  const openEditForm = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      image: p.image,
      price: p.price !== undefined ? String(p.price) : "",
      available: p.available,
      isNew: p.isNew,
      quantity: p.quantity !== undefined ? String(p.quantity) : "",
    });
    setError("");
    setShowForm(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, image: dataUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setError("Le nom et la description sont obligatoires.");
      return;
    }

    const priceValue = form.price.trim() === "" ? undefined : Number(form.price);
    const quantityValue = form.quantity.trim() === "" ? undefined : Number(form.quantity);

    if (editingId) {
      updateProduct(editingId, {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image,
        price: priceValue,
        available: form.available,
        isNew: form.isNew,
        quantity: quantityValue,
      });
      showToast("Parfum modifié avec succès.", "success");
    } else {
      const newProduct: Product = {
        id: generateId(),
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image,
        price: priceValue,
        available: form.available,
        isNew: form.isNew,
        quantity: quantityValue,
        createdAt: Date.now(),
      };
      addProduct(newProduct);
      showToast("Parfum ajouté avec succès.", "success");
    }

    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Supprimer ce parfum ?")) return;
    deleteProduct(id);
    showToast("Parfum supprimé.", "info");
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-elda-purple-dark">
          Produits ({products.length})
        </h2>
        <button type="button" onClick={openAddForm} className="btn-primary !px-5 !py-2.5 text-sm">
          + Ajouter un parfum
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda"
        >
          <h3 className="font-display text-base font-semibold text-elda-purple">
            {editingId ? "Modifier le parfum" : "Nouveau parfum"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Nom du parfum"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-elda"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="input-elda"
            >
              {CATEGORIES.map((c) => (
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
            className="input-elda min-h-[80px]"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs text-elda-black/60">Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="input-elda !py-2 text-xs" />
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="aperçu" className="mt-2 h-20 w-20 rounded-lg object-cover" />
              )}
            </div>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Prix (laisser vide si non défini)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-elda"
              />
              <input
                type="number"
                placeholder="Quantité disponible"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="input-elda"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-elda-black/70">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Disponible
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-elda-black/70">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              />
              Nouveauté
            </label>
          </div>
          {error && <p className="font-body text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
          <p className="font-body text-sm text-elda-black/60">Aucun produit pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border border-elda-gold/20 bg-white p-4 shadow-elda">
              <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-elda-beige">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-elda-purple/40">ELDA BEAUTY</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge bg-elda-purple/10 text-elda-purple">{p.category}</span>
                {p.isNew && <span className="badge bg-elda-gold text-elda-black">Nouveau</span>}
                <span
                  className={`badge ${
                    p.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.available ? "Disponible" : "Rupture"}
                </span>
              </div>
              <h3 className="mt-2 font-display text-sm font-semibold text-elda-black">{p.name}</h3>
              <p className="mt-1 font-body text-sm font-semibold text-elda-gold-dark">
                {formatPrice(p.price)}
              </p>
              {p.quantity !== undefined && (
                <p className="font-body text-xs text-elda-black/50">Stock : {p.quantity}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(p)}
                  className="btn-secondary flex-1 !px-3 !py-1.5 text-xs"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
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
