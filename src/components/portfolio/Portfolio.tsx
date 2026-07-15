"use client";

import { useState } from "react";
import { usePortfolioI18n } from "@/lib/portfolio-i18n";
import { Projects } from "@/components/portfolio/Projects";
import { InfoSec } from "@/components/portfolio/InfoSec";

type Area = "dev" | "infosec";

export function Portfolio() {
  const { t } = usePortfolioI18n();
  const [area, setArea] = useState<Area>("dev");

  return (
    <section className="nv-portfolio nv-section" id="portfolio">
      <h2 className="nv-section__title">{t("portfolio.title")}</h2>
      <span className="nv-section__subtitle">{t("portfolio.subtitle")}</span>

      <div className="nv-portfolio__tabs nv-container">
        <div
          className={`nv-portfolio__tab${area === "dev" ? " nv-portfolio__tab--active" : ""}`}
          onClick={() => setArea("dev")}
        >
          <i className="uil uil-brackets-curly nv-portfolio__tab-icon"></i>
          {t("portfolio.areaDev")}
        </div>

        <div
          className={`nv-portfolio__tab${area === "infosec" ? " nv-portfolio__tab--active" : ""}`}
          onClick={() => setArea("infosec")}
        >
          <i className="uil uil-shield-check nv-portfolio__tab-icon"></i>
          {t("infosec.title")}
        </div>
      </div>

      {area === "dev" ? <Projects /> : <InfoSec />}
    </section>
  );
}
