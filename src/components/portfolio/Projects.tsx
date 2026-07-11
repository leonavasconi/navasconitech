"use client";

import { useState } from "react";
import Link from "next/link";
import { usePortfolioI18n } from "@/lib/portfolio-i18n";
import { usePortfolioLightbox } from "@/lib/portfolio-lightbox";

const LF_GALLERY = [
  "/assets/img/lf-sistema/dashboard.png",
  "/assets/img/lf-sistema/login.png",
  "/assets/img/lf-sistema/chat.png",
  "/assets/img/lf-sistema/analise.png",
  "/assets/img/lf-sistema/resultado-analise.png",
].map((src) => ({ src, type: "image" as const }));

export function Projects() {
  const { t } = usePortfolioI18n();
  const { open } = usePortfolioLightbox();
  const [active, setActive] = useState(0);

  const slides = [
    {
      key: "arhus",
      img: "/assets/img/arhus.png",
      title: "Arhus",
      description: t("portfolio.arhus.description"),
      action: (
        <a
          href="https://arhus.com.br/"
          target="_blank"
          className="nv-button nv-button--flex nv-button--small nv-portfolio__button"
        >
          {t("portfolio.seeProject")} <i className="uil uil-arrow-right nv-button__icon"></i>
        </a>
      ),
    },
    {
      key: "lf",
      img: "/assets/img/lf-sistema/dashboard.png",
      imgOnClick: () => open(LF_GALLERY, LF_GALLERY[0].src),
      title: t("portfolio.lf.title"),
      description: t("portfolio.lf.description"),
      action: (
        <button
          type="button"
          className="nv-button nv-button--flex nv-button--small nv-portfolio__button"
          onClick={() => open(LF_GALLERY, LF_GALLERY[0].src)}
        >
          {t("portfolio.seeScreens")} <i className="uil uil-arrow-right nv-button__icon"></i>
        </button>
      ),
    },
    {
      key: "presenca",
      img: "/assets/img/portfolio/unisanta-presenca.png",
      title: t("portfolio.presenca.title"),
      description: t("portfolio.presenca.description"),
      action: (
        <a
          href="https://sistema-presenca-unisanta.vercel.app/criar-conta"
          target="_blank"
          className="nv-button nv-button--flex nv-button--small nv-portfolio__button"
        >
          {t("portfolio.seeProject")} <i className="uil uil-arrow-right nv-button__icon"></i>
        </a>
      ),
    },
    {
      key: "jogos",
      img: "/assets/img/portfolio/unisanta-jogos.png",
      title: t("portfolio.jogos.title"),
      description: t("portfolio.jogos.description"),
      action: (
        <a
          href="https://jogos-unisanta.vercel.app"
          target="_blank"
          className="nv-button nv-button--flex nv-button--small nv-portfolio__button"
        >
          {t("portfolio.seeProject")} <i className="uil uil-arrow-right nv-button__icon"></i>
        </a>
      ),
    },
    {
      key: "financas",
      img: "/assets/img/portfolio/financas.png",
      title: t("portfolio.financas.title"),
      description: t("portfolio.financas.description"),
      action: (
        <Link href="/financas" className="nv-button nv-button--flex nv-button--small nv-portfolio__button">
          {t("portfolio.seeProject")} <i className="uil uil-arrow-right nv-button__icon"></i>
        </Link>
      ),
    },
    {
      key: "marketplace",
      placeholderIcon: "uil-shopping-bag",
      title: t("portfolio.marketplace.title"),
      description: t("portfolio.marketplace.description"),
      action: (
        <span className="nv-button nv-button--flex nv-button--small nv-portfolio__button">
          {t("portfolio.inProgress")}
        </span>
      ),
    },
  ];

  const goTo = (index: number) => setActive((index + slides.length) % slides.length);

  return (
    <section className="nv-portfolio nv-section" id="portfolio">
      <h2 className="nv-section__title">{t("portfolio.title")}</h2>
      <span className="nv-section__subtitle">{t("portfolio.subtitle")}</span>

      <div className="nv-portfolio__container nv-container">
        <div className="nv-portfolio__content nv-grid">
          {(() => {
            const slide = slides[active];
            return (
              <>
                {slide.img ? (
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="nv-portfolio__img"
                    onClick={slide.imgOnClick}
                    style={slide.imgOnClick ? { cursor: "pointer" } : undefined}
                  />
                ) : (
                  <div className="nv-portfolio__img nv-portfolio__img--placeholder">
                    <i className={`uil ${slide.placeholderIcon}`}></i>
                  </div>
                )}

                <div className="nv-portfolio__data">
                  <h3 className="nv-portfolio__title">{slide.title}</h3>
                  <p
                    className="nv-portfolio__description"
                    dangerouslySetInnerHTML={{ __html: slide.description }}
                  />
                  {slide.action}
                </div>
              </>
            );
          })()}
        </div>

        <div className="nv-swiper-button-next" onClick={() => goTo(active + 1)}>
          <i className="uil uil-angle-right-b nv-swiper-portfolio-icon"></i>
        </div>
        <div className="nv-swiper-button-prev" onClick={() => goTo(active - 1)}>
          <i className="uil uil-angle-left-b nv-swiper-portfolio-icon"></i>
        </div>

        <div className="nv-swiper-container-horizontal">
          <div className="nv-swiper-pagination-bullets">
            {slides.map((slide, i) => (
              <span
                key={slide.key}
                className={`nv-swiper-pagination-bullet${i === active ? " nv-swiper-pagination-bullet-active" : ""}`}
                onClick={() => goTo(i)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
