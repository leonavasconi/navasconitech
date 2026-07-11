"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";

export function Footer() {
  const { t } = usePortfolioI18n();

  return (
    <footer className="nv-footer">
      <div className="nv-footer__bg">
        <div className="nv-footer__container nv-container nv-grid">
          <div>
            <h1 className="nv-footer__title">Leonardo N.</h1>
            <span className="nv-footer__subtitle">{t("footer.subtitle")}</span>
          </div>

          <ul className="nv-footer__links">
            <li>
              <a href="#portfolio" className="nv-footer__link">
                {t("footer.portfolio")}
              </a>
            </li>
            <li>
              <a href="#activities" className="nv-footer__link">
                {t("footer.activities")}
              </a>
            </li>
            <li>
              <a href="#contact" className="nv-footer__link">
                {t("footer.contact")}
              </a>
            </li>
          </ul>

          <div className="nv-footer__socials">
            <a
              href="https://www.linkedin.com/in/leonardo-navasconi/"
              target="_blank"
              className="nv-footer__social"
            >
              <i className="uil uil-linkedin-alt"></i>
            </a>
            <a
              href="https://www.instagram.com/leonavasconi/"
              target="_blank"
              className="nv-footer__social"
            >
              <i className="uil uil-instagram"></i>
            </a>
          </div>
        </div>

        <p className="nv-footer__copy">{t("footer.copy")}</p>
      </div>
    </footer>
  );
}
