"use client";

import { usePortfolioI18n } from "@/lib/portfolio-i18n";

const SERVICE_KEYS = [
  "infosec.services.item1",
  "infosec.services.item2",
  "infosec.services.item3",
  "infosec.services.item4",
  "infosec.services.item5",
  "infosec.services.item6",
];

const COMPANIES = [
  { file: "american.png", name: "American Airlines", large: true },
  { file: "azul.png", name: "Azul", large: true },
  { file: "ecoporto.png", name: "Ecoporto" },
  { file: "helibras.png", name: "Helibras" },
  { file: "leonardo.png", name: "Leonardo" },
  { file: "libraport.png", name: "LibraPort Campinas", large: true },
  { file: "randoncorp.png", name: "Randoncorp" },
  { file: "ternium.png", name: "Ternium" },
];

export function InfoSec() {
  const { t } = usePortfolioI18n();

  return (
    <div className="nv-infosec__container nv-container">
      <p className="nv-infosec__presentation">{t("infosec.presentation")}</p>

      <h3 className="nv-infosec__block-title">{t("infosec.services.title")}</h3>
      <ul className="nv-infosec__services nv-grid">
        {SERVICE_KEYS.map((key) => (
          <li className="nv-infosec__service" key={key}>
            <i className="uil uil-shield-check nv-infosec__service-icon"></i>
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>

      <h3 className="nv-infosec__block-title">{t("infosec.companies.title")}</h3>
      <div className="nv-infosec__companies">
        {COMPANIES.map((company) => (
          <div className="nv-infosec__company" key={company.file}>
            <img
              src={`/assets/img/infosec/${company.file}`}
              alt={company.name}
              className={company.large ? "nv-infosec__company-img--large" : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
