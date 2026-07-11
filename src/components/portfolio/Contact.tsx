"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";

export function Contact() {
  const { t } = usePortfolioI18n();

  return (
    <section className="nv-contact nv-section" id="contact">
      <h2 className="nv-section__title">{t("contact.title")}</h2>
      <span className="nv-section__subtitle">{t("contact.subtitle")}</span>

      <div className="nv-contact__container nv-container nv-grid">
        <div className="nv-contact__information">
          <i className="uil uil-phone nv-contact__icon"></i>
          <div>
            <h3 className="nv-contact__title">{t("contact.call")}</h3>
            <span className="nv-contact__subtitle">(13) 98213-7122&nbsp;</span>
          </div>
        </div>

        <div className="nv-contact__information">
          <i className="uil uil-envelope nv-contact__icon"></i>
          <div>
            <h3 className="nv-contact__title">Email</h3>
            <span className="nv-contact__subtitle">navasconi.tech@gmail.com</span>
          </div>
        </div>

        <div className="nv-contact__information">
          <i className="uil uil-map-marker nv-contact__icon"></i>
          <div>
            <h3 className="nv-contact__title">{t("contact.location")}</h3>
            <span className="nv-contact__subtitle">Santos - SP, Brasil</span>
          </div>
        </div>
      </div>
    </section>
  );
}
