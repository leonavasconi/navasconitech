"use client";

import { useEffect } from "react";
import { usePortfolioLightbox } from "@/lib/portfolio-lightbox";

export function Lightbox() {
  const { isOpen, items, index, close, next, prev } = usePortfolioLightbox();
  const current = items[index];

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, next, prev]);

  return (
    <div
      className={`nv-lightbox${isOpen ? " nv-active-modal" : ""}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <span className="nv-lightbox__close" onClick={close}>
        <i className="uil uil-times"></i>
      </span>

      {items.length > 1 && (
        <span className="nv-lightbox__nav nv-lightbox__prev" onClick={prev}>
          <i className="uil uil-angle-left-b"></i>
        </span>
      )}

      <div className="nv-lightbox__content">
        {current &&
          (current.type === "video" ? (
            <video src={current.src} controls autoPlay />
          ) : (
            <img src={current.src} alt="" />
          ))}
      </div>

      {items.length > 1 && (
        <span className="nv-lightbox__nav nv-lightbox__next" onClick={next}>
          <i className="uil uil-angle-right-b"></i>
        </span>
      )}
    </div>
  );
}
