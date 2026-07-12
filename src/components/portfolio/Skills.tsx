"use client";

import { useState } from "react";
import { usePortfolioI18n } from "@/lib/portfolio-i18n";

interface SkillItem {
  name?: string;
  nameKey?: string;
  percent: number;
}

interface SkillCategory {
  icon: string;
  titleKey: string;
  subtitleKey: string;
  items: SkillItem[];
}

const COLUMN_1: SkillCategory[] = [
  {
    icon: "uil-server-network",
    titleKey: "skills.backend.title",
    subtitleKey: "skills.backend.subtitle",
    items: [
      { name: "C#", percent: 90 },
      { name: "PHP", percent: 100 },
      { name: "SQL", percent: 90 },
      { name: "Node.js", percent: 85 },
      { name: ".NET / Express.js", percent: 80 },
      { name: "Python", percent: 75 },
    ],
  },
  {
    icon: "uil-brackets-curly",
    titleKey: "skills.frontend.title",
    subtitleKey: "skills.frontend.subtitle",
    items: [
      { name: "HTML5", percent: 100 },
      { name: "CSS3", percent: 100 },
      { name: "JavaScript / TypeScript", percent: 90 },
      { name: "React.js / Next.js", percent: 85 },
      { name: "Angular / React Native", percent: 65 },
    ],
  },
];

const COLUMN_2: SkillCategory[] = [
  {
    icon: "uil-database",
    titleKey: "skills.data.title",
    subtitleKey: "skills.data.subtitle",
    items: [
      { name: "PostgreSQL / Supabase", percent: 85 },
      { name: "MySQL / SQL Server", percent: 85 },
      { name: "MongoDB / Firebase", percent: 80 },
      { name: "Docker", percent: 70 },
      { name: "GitHub Actions / Azure DevOps", percent: 75 },
      { name: "Vercel / Netlify", percent: 85 },
    ],
  },
  {
    icon: "uil-shield-check",
    titleKey: "skills.security.title",
    subtitleKey: "skills.security.subtitle",
    items: [
      { nameKey: "skills.security.item1", percent: 90 },
      { nameKey: "skills.security.item2", percent: 90 },
      { nameKey: "skills.security.item3", percent: 90 },
      { nameKey: "skills.security.item4", percent: 85 },
      { nameKey: "skills.security.item5", percent: 80 },
    ],
  },
  {
    icon: "uil-swatchbook",
    titleKey: "skills.automation.title",
    subtitleKey: "skills.automation.subtitle",
    items: [
      { name: "N8N / Power Automate", percent: 95 },
      { name: "Power Apps", percent: 95 },
      { name: "Power BI", percent: 70 },
      { name: "SharePoint", percent: 100 },
      { name: "WordPress", percent: 100 },
      { name: "Git / GitHub / GitLab", percent: 80 },
    ],
  },
];

function SkillAccordion({
  category,
  isOpen,
  onToggle,
}: {
  category: SkillCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { t } = usePortfolioI18n();

  return (
    <div className={`nv-skills__content ${isOpen ? "nv-skills__open" : "nv-skills__close"}`}>
      <div className="nv-skills__header" onClick={onToggle}>
        <i className={`uil ${category.icon} nv-skills__icon`}></i>

        <div>
          <h1 className="nv-skills__title">{t(category.titleKey)}</h1>
          <span className="nv-skills__subtitle">{t(category.subtitleKey)}</span>
        </div>

        <i className="uil uil-angle-down nv-skills__arrow"></i>
      </div>

      <div className="nv-skills__list nv-grid">
        {category.items.map((item) => (
          <div className="nv-skills__data" key={item.name ?? item.nameKey}>
            <div className="nv-skills__titles">
              <h3 className="nv-skills__name">{item.nameKey ? t(item.nameKey) : item.name}</h3>
              <span className="nv-skills__number">{item.percent}%</span>
            </div>
            <div className="nv-skills__bar">
              <span className="nv-skills__percentage" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const { t } = usePortfolioI18n();
  const [openKey, setOpenKey] = useState<string | null>("skills.backend.title");

  const toggle = (key: string) => setOpenKey((current) => (current === key ? null : key));

  return (
    <section className="nv-skills nv-section" id="skills">
      <h2 className="nv-section__title">{t("skills.title")}</h2>
      <span className="nv-section__subtitle">{t("skills.subtitle")}</span>

      <div className="nv-skills__container nv-container nv-grid">
        <div>
          {COLUMN_1.map((category) => (
            <SkillAccordion
              key={category.titleKey}
              category={category}
              isOpen={openKey === category.titleKey}
              onToggle={() => toggle(category.titleKey)}
            />
          ))}
        </div>

        <div>
          {COLUMN_2.map((category) => (
            <SkillAccordion
              key={category.titleKey}
              category={category}
              isOpen={openKey === category.titleKey}
              onToggle={() => toggle(category.titleKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
