"use client";

import { useEffect, useState } from "react";
import { usePortfolioI18n, type Lang } from "@/lib/portfolio-i18n";
import { usePortfolioTheme } from "@/lib/portfolio-theme";

const SECTIONS = ["home", "about", "skills", "portfolio", "activities", "contact"];

const LANG_FLAGS: Record<Lang, string> = {
  pt: "br",
  en: "us",
  es: "es",
};

const LANG_NAMES: Record<Lang, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

export function Header() {
  const { t, lang, setLang } = usePortfolioI18n();
  const { theme, toggle } = usePortfolioTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY >= 80);

      let current = "home";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop - 58;
        if (window.scrollY >= top) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItem = (id: string, icon: string, key: string) => (
    <li className="nv-nav__item" key={id}>
      <a
        href={`#${id}`}
        className={`nv-nav__link${activeSection === id ? " nv-active-link" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        <i className={`uil ${icon} nv-nav__icon`}></i> <span>{t(key)}</span>
      </a>
    </li>
  );

  return (
    <header className={`nv-header${scrolled ? " nv-scroll-header" : ""}`} id="home-header">
      <nav className="nv-nav nv-container">
        <a href="#home" className="nv-nav__logo">
          Leonardo Navasconi
        </a>

        <div className={`nv-nav__menu${menuOpen ? " nv-show-menu" : ""}`}>
          <ul className="nv-nav__list nv-grid">
            {navItem("home", "uil-estate", "nav.home")}
            {navItem("about", "uil-user", "nav.about")}
            {navItem("skills", "uil-file-alt", "nav.skills")}
            {navItem("portfolio", "uil-scenery", "nav.portfolio")}
            {navItem("activities", "uil-medal", "nav.activities")}
            {navItem("contact", "uil-message", "nav.contact")}
          </ul>

          <i
            className="uil uil-times nv-nav__close"
            onClick={() => setMenuOpen(false)}
          ></i>
        </div>

        <div className="nv-nav__btns">
          <div className="nv-nav__lang">
            {(["pt", "en", "es"] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                className={`nv-nav__lang-btn${lang === code ? " nv-active-lang" : ""}`}
                onClick={() => setLang(code)}
                aria-label={LANG_NAMES[code]}
                title={LANG_NAMES[code]}
              >
                <img
                  src={`https://flagcdn.com/w40/${LANG_FLAGS[code]}.png`}
                  alt={LANG_NAMES[code]}
                  className="nv-nav__lang-flag"
                />
              </button>
            ))}
          </div>

          <i
            className={`uil ${theme === "dark" ? "uil-sun" : "uil-moon"} nv-change-theme`}
            onClick={toggle}
          ></i>

          <div className="nv-nav__toggle" onClick={() => setMenuOpen(true)}>
            <i className="uil uil-apps"></i>
          </div>
        </div>
      </nav>
    </header>
  );
}
