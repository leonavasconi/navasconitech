"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { createProduct } from "@/app/marketplace/painel/actions";
import type { MarketplaceCategory } from "@/lib/types";

export function ProductForm({ categories }: { categories: MarketplaceCategory[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price) {
      setError("Preencha nome e preço.");
      return;
    }

    setUploading(true);
    try {
      const imageUrls: string[] = [];
      if (photos.length > 0) {
        const supabase = createClient();
        for (const photo of photos) {
          const path = `${crypto.randomUUID()}-${photo.name}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(path, photo);
          if (uploadError) throw new Error(uploadError.message);
          const { data } = supabase.storage.from("product-images").getPublicUrl(path);
          imageUrls.push(data.publicUrl);
        }
      }

      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock: Number(stock),
        categoryId: categoryId || undefined,
        imageUrls,
      });

      router.push("/marketplace/painel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Descrição</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/40"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Preço" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input
          label="Preço de/por (opcional)"
          type="number"
          step="0.01"
          value={compareAtPrice}
          onChange={(e) => setCompareAtPrice(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Estoque" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        <Select label="Categoria" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Sem categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Fotos</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
          className="w-full text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? "Publicando..." : "Publicar produto"}
      </Button>
    </form>
  );
}
