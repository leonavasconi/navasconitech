"use client";

import { useState } from "react";
import { usePortfolioI18n } from "@/lib/portfolio-i18n";

interface QualificationItem {
  titleKey: string;
  subtitle?: string;
  subtitleKey?: string;
  dates?: string;
  datesKey?: string;
}

const EDUCATION: QualificationItem[] = [
  { titleKey: "qualification.edu1.title", subtitle: "Fundação Richard Hugh Fisk", dates: "2011 - 2022" },
  { titleKey: "qualification.edu2.title", subtitle: "Etec de Praia Grande", dates: "2020 - 2022" },
  { titleKey: "qualification.edu3.title", subtitle: "Universidade Santa Cecília", dates: "2023 - 2026" },
  { titleKey: "qualification.edu4.title", subtitle: "Alura", dates: "2023 - 2024" },
];

const WORK: QualificationItem[] = [
  { titleKey: "qualification.work1.title", subtitleKey: "qualification.work1.subtitle", dates: "02/2023 - 07/2023" },
  { titleKey: "qualification.work2.title", subtitleKey: "qualification.work2.subtitle", dates: "07/2023 - 07/2025" },
  { titleKey: "qualification.work3.title", subtitleKey: "qualification.work3.subtitle", datesKey: "qualification.work3.dates" },
];

function Timeline({ items }: { items: QualificationItem[] }) {
  const { t } = usePortfolioI18n();

  return (
    <>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const isLeft = i % 2 === 0;

        const content = (
          <div>
            <h3 className="nv-qualification__title">{t(item.titleKey)}</h3>
            <span className="nv-qualification__subtitle">
              {item.subtitleKey ? t(item.subtitleKey) : item.subtitle}
            </span>
            <div className="nv-qualification__calendar">
              <i className="uil uil-calendar-alt"></i>{" "}
              {item.datesKey ? t(item.datesKey) : item.dates}
            </div>
          </div>
        );

        const marker = (
          <div className={isLast ? "nv-qualification__time" : undefined}>
            <span className="nv-qualification__rounder"></span>
            {!isLast && <span className="nv-qualification__line"></span>}
          </div>
        );

        return (
          <div className="nv-qualification__data" key={item.titleKey}>
            {isLeft ? (
              <>
                {content}
                {marker}
              </>
            ) : (
              <>
                <div></div>
                {marker}
                {content}
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

export function Qualification() {
  const { t } = usePortfolioI18n();
  const [tab, setTab] = useState<"education" | "work">("education");

  return (
    <section className="nv-qualification nv-section">
      <h2 className="nv-section__title">{t("qualification.title")}</h2>
      <span className="nv-section__subtitle">{t("qualification.subtitle")}</span>

      <div className="nv-qualification__container nv-container">
        <div className="nv-qualification__tabs">
          <div
            className={`nv-qualification__button nv-button--flex${tab === "education" ? " nv-qualification__active" : ""}`}
            onClick={() => setTab("education")}
          >
            <i className="uil uil-graduation-cap nv-qualification__icon"></i>
            {t("qualification.tabEducation")}
          </div>

          <div
            className={`nv-qualification__button nv-button--flex${tab === "work" ? " nv-qualification__active" : ""}`}
            onClick={() => setTab("work")}
          >
            <i className="uil uil-briefcase-alt nv-qualification__icon"></i>
            {t("qualification.tabWork")}
          </div>
        </div>

        <div className="nv-qualification__sections">
          <div
            data-content=""
            className={`nv-qualification__content${tab === "education" ? " nv-qualification__active" : ""}`}
          >
            <Timeline items={EDUCATION} />
          </div>

          <div
            data-content=""
            className={`nv-qualification__content${tab === "work" ? " nv-qualification__active" : ""}`}
          >
            <Timeline items={WORK} />
          </div>
        </div>
      </div>
    </section>
  );
}
