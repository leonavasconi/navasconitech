"use client";

import { createContext, useContext, useState } from "react";

export interface GalleryItem {
  src: string;
  type: "image" | "video";
}

interface LightboxContextValue {
  isOpen: boolean;
  items: GalleryItem[];
  index: number;
  open: (items: GalleryItem[], startSrc: string) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function PortfolioLightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [index, setIndex] = useState(0);

  const open = (galleryItems: GalleryItem[], startSrc: string) => {
    const unique = galleryItems.filter(
      (item, i) => galleryItems.findIndex((other) => other.src === item.src) === i,
    );
    const startIndex = Math.max(
      0,
      unique.findIndex((item) => item.src === startSrc),
    );
    setItems(unique);
    setIndex(startIndex);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);
  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <LightboxContext.Provider value={{ isOpen, items, index, open, close, next, prev }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function usePortfolioLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("usePortfolioLightbox must be used within PortfolioLightboxProvider");
  return ctx;
}
