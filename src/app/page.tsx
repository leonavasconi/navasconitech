import "@/styles/portfolio.css";
import { PortfolioThemeProvider } from "@/lib/portfolio-theme";
import { PortfolioI18nProvider } from "@/lib/portfolio-i18n";
import { PortfolioLightboxProvider } from "@/lib/portfolio-lightbox";
import { Header } from "@/components/portfolio/Header";
import { Home } from "@/components/portfolio/Home";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Qualification } from "@/components/portfolio/Qualification";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Activities } from "@/components/portfolio/Activities";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollTop } from "@/components/portfolio/ScrollTop";
import { Lightbox } from "@/components/portfolio/Lightbox";

export default function PortfolioPage() {
  return (
    <PortfolioThemeProvider>
      <link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.6/css/line.css" />
      <PortfolioI18nProvider>
        <PortfolioLightboxProvider>
          <Header />
          <main className="nv-main">
            <Home />
            <About />
            <Skills />
            <Qualification />
            <Portfolio />
            <Activities />
            <Contact />
          </main>
          <Footer />
          <ScrollTop />
          <Lightbox />
        </PortfolioLightboxProvider>
      </PortfolioI18nProvider>
    </PortfolioThemeProvider>
  );
}
