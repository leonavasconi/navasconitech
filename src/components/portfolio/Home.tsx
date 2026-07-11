"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";

export function Home() {
  const { t } = usePortfolioI18n();

  return (
    <section className="nv-home nv-section" id="home">
      <div className="nv-home__container nv-container nv-grid">
        <div className="nv-home__content nv-grid">
          <div className="nv-home__social">
            <a
              href="https://www.linkedin.com/in/leonardo-navasconi/"
              target="_blank"
              className="nv-home__social-icon"
            >
              <i className="uil uil-linkedin-alt"></i>
            </a>

            <a
              href="https://www.instagram.com/leonavasconi/"
              target="_blank"
              className="nv-home__social-icon"
            >
              <i className="uil uil-instagram"></i>
            </a>
          </div>

          <div className="nv-home__img">
            <svg className="nv-home__blob" viewBox="0 0 200 187">
              <mask id="mask0" mask-type="alpha">
                <path d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z" />
              </mask>
              <g mask="url(#mask0)">
                <path d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z" />
                <image className="nv-home__blob-img" x="-11" y="18" href="/assets/img/foto_leo.png" />
              </g>
            </svg>
          </div>

          <div className="nv-home__data">
            <h1 className="nv-home__title">{t("home.title")}</h1>
            <h3
              className="nv-home__subtitle"
              dangerouslySetInnerHTML={{ __html: t("home.subtitle") }}
            />
            <p className="nv-home__description">{t("home.description")}</p>
            <a href="#contact" className="nv-button nv-button--flex">
              {t("home.contact")} <i className="uil uil-message nv-button__icon"></i>
            </a>
          </div>
        </div>

        <div className="nv-home__scroll">
          <a href="#about" className="nv-home__scroll-button nv-button--flex">
            <i className="uil uil-mouse-alt nv-home__scroll-mouse"></i>
            <span className="nv-home__scroll-name">{t("home.scroll")}</span>
            <i className="uil uil-arrow-down nv-home__scroll-arrow"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
