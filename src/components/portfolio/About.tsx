"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";

export function About() {
  const { t } = usePortfolioI18n();

  return (
    <section className="nv-about nv-section" id="about">
      <h2 className="nv-section__title">{t("about.title")}</h2>
      <span className="nv-section__subtitle">{t("about.subtitle")}</span>

      <div className="nv-about__container nv-about__container--single nv-container nv-grid">
        <div className="nv-about__data">
          <div className="nv-about__description">
            <p>{t("about.description1")}</p>
            <p>{t("about.description2")}</p>
            <p>{t("about.description3")}</p>
          </div>

          <div className="nv-about__info">
            <div>
              <span className="nv-about__info-title">5+</span>
              <span
                className="nv-about__info-name"
                dangerouslySetInnerHTML={{ __html: t("about.info1Name") }}
              />
            </div>

            <div>
              <span className="nv-about__info-title">30+</span>
              <span
                className="nv-about__info-name"
                dangerouslySetInnerHTML={{ __html: t("about.info2Name") }}
              />
            </div>

            <div>
              <span className="nv-about__info-title">2+</span>
              <span
                className="nv-about__info-name"
                dangerouslySetInnerHTML={{ __html: t("about.info3Name") }}
              />
            </div>
          </div>

          <div className="nv-about__buttons">
            <a download href="/assets/pdf/CV - Leonardo Navasconi.pdf" className="nv-button nv-button--flex">
              {t("about.downloadCV")} <i className="uil uil-download-alt nv-button__icon"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
