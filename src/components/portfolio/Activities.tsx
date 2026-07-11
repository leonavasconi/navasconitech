"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";
import { usePortfolioLightbox, type GalleryItem } from "@/lib/portfolio-lightbox";

const TCC_GALLERY: GalleryItem[] = [
  { src: "/assets/img/activities/tcc.jpeg", type: "image" },
  { src: "/assets/img/activities/conseg.jpeg", type: "image" },
  { src: "/assets/img/activities/ace.jpeg", type: "image" },
  { src: "/assets/video/reuniao-ace.mp4", type: "video" },
];

const UNISANTA_GALLERY: GalleryItem[] = [{ src: "/assets/video/unisanta.mp4", type: "video" }];

const SCHOLARSHIP_GALLERY: GalleryItem[] = [{ src: "/assets/img/sea1.png", type: "image" }];

export function Activities() {
  const { t } = usePortfolioI18n();
  const { open } = usePortfolioLightbox();

  return (
    <section className="nv-activities nv-section" id="activities">
      <h2 className="nv-section__title">{t("activities.title")}</h2>
      <span className="nv-section__subtitle">{t("activities.subtitle")}</span>

      <div className="nv-activities__container nv-container nv-grid">
        <div className="nv-activities__card">
          <div className="nv-activities__badge">
            <i className="uil uil-trophy"></i>
          </div>
          <h3 className="nv-activities__title">{t("activities.hackathon.title")}</h3>
          <p className="nv-activities__description">{t("activities.hackathon.description")}</p>
        </div>

        <div className="nv-activities__card">
          <div
            className="nv-activities__cover nv-activities__cover--video"
            onClick={() => open(UNISANTA_GALLERY, UNISANTA_GALLERY[0].src)}
          >
            <i className="uil uil-play"></i>
            <span>{t("activities.watchVideo")}</span>
          </div>
          <h3 className="nv-activities__title">{t("activities.unisanta.title")}</h3>
          <p className="nv-activities__description">{t("activities.unisanta.description")}</p>
        </div>

        <div className="nv-activities__card">
          <img
            className="nv-activities__cover"
            src="/assets/img/sea1.png"
            alt="Save the Sea"
            onClick={() => open(SCHOLARSHIP_GALLERY, SCHOLARSHIP_GALLERY[0].src)}
          />
          <h3 className="nv-activities__title">{t("activities.scholarship.title")}</h3>
          <p className="nv-activities__description">{t("activities.scholarship.description")}</p>
        </div>

        <div className="nv-activities__card">
          <img
            className="nv-activities__cover"
            src="/assets/img/activities/tcc.jpeg"
            alt="TCC Arhus"
            onClick={() => open(TCC_GALLERY, TCC_GALLERY[0].src)}
          />
          <h3 className="nv-activities__title">{t("activities.tcc.title")}</h3>
          <p className="nv-activities__description">{t("activities.tcc.description")}</p>

          <div className="nv-activities__gallery">
            <img
              className="nv-activities__thumb"
              src="/assets/img/activities/conseg.jpeg"
              alt="CONSEG"
              onClick={() => open(TCC_GALLERY, TCC_GALLERY[1].src)}
            />
            <img
              className="nv-activities__thumb"
              src="/assets/img/activities/ace.jpeg"
              alt="ACE"
              onClick={() => open(TCC_GALLERY, TCC_GALLERY[2].src)}
            />
            <div
              className="nv-activities__thumb nv-activities__thumb--video"
              onClick={() => open(TCC_GALLERY, TCC_GALLERY[3].src)}
            >
              <i className="uil uil-play"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
