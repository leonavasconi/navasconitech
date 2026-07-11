"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "pt" | "en" | "es";

const translations: Record<Lang, Record<string, string>> = {
  pt: {
    "nav.home": "Home",
    "nav.about": "Sobre",
    "nav.skills": "Habilidades",
    "nav.portfolio": "Portfólio",
    "nav.activities": "Atividades",
    "nav.contact": "Contato",

    "home.title": "Olá, eu sou o Leo",
    "home.subtitle": "Desenvolvedor Full Stack &amp; Analista de Segurança da Informação",
    "home.description":
      "Desenvolvedor Full Stack e Analista de Segurança da Informação, com experiência em aplicações web, automação corporativa, inteligência artificial e cibersegurança.",
    "home.contact": "Fale Comigo",
    "home.scroll": "Rolar para baixo",

    "about.title": "Sobre Mim",
    "about.subtitle": "Minha introdução",
    "about.description":
      "Desenvolvedor Full Stack e Analista de Segurança da Informação, com experiência no desenvolvimento de aplicações web, automação corporativa, inteligência artificial e cibersegurança. Atuo também em consultoria de segurança da informação, gestão de acessos e conformidade para certificações como OEA, contribuindo para a proteção de dados e a eficiência operacional das empresas.",
    "about.info1Name": "Anos de<br/>experiência",
    "about.info2Name": "Projetos<br/>concluídos",
    "about.info3Name": "Empresas<br/>em que atuei",
    "about.downloadCV": "Baixar Currículo",

    "skills.title": "Habilidades",
    "skills.subtitle": "Meu nível técnico",
    "skills.backend.title": "Desenvolvimento Backend",
    "skills.backend.subtitle": "Mais de 3 anos",
    "skills.frontend.title": "Desenvolvimento Frontend",
    "skills.frontend.subtitle": "Mais de 3 anos",
    "skills.data.title": "Banco de Dados &amp; Cloud",
    "skills.data.subtitle": "Mais de 2 anos",
    "skills.security.title": "Segurança da Informação",
    "skills.security.subtitle": "Mais de 1 ano",
    "skills.security.item1": "Cibersegurança",
    "skills.security.item2": "Gestão de Acessos (IAM)",
    "skills.security.item3": "Compliance &amp; OEA",
    "skills.security.item4": "Proteção de Dados (LGPD)",
    "skills.security.item5": "Gestão de Riscos",
    "skills.automation.title": "Automação &amp; Produtividade",
    "skills.automation.subtitle": "Mais de 3 anos",

    "qualification.title": "Qualificação",
    "qualification.subtitle": "Minha trajetória",
    "qualification.tabEducation": "Formação",
    "qualification.tabWork": "Experiência",
    "qualification.edu1.title": "Inglês Avançado",
    "qualification.edu2.title": "Técnico em Informática",
    "qualification.edu3.title": "Bacharelado em Sistemas de Informação",
    "qualification.edu4.title": "Desenvolvimento Full Stack",
    "qualification.work1.title": "Estagiário de TI",
    "qualification.work1.subtitle": "Logic Minds - Brasil",
    "qualification.work2.title": "Estagiário de TI | Automação e Desenvolvimento",
    "qualification.work2.subtitle": "LF Auditoria e Consultoria - Brasil",
    "qualification.work3.title": "Analista de Segurança da Informação",
    "qualification.work3.subtitle": "LF Auditoria e Consultoria - Brasil",
    "qualification.work3.dates": "07/2025 - Atual",

    "portfolio.title": "Portfólio",
    "portfolio.subtitle": "Trabalhos recentes",
    "portfolio.arhus.description":
      "Sistema para registro e visualização de furtos e roubos através de um mapa interativo. TCC premiado com destaque regional e apoio institucional do CONSEG e da ACE.<br/>Ferramentas: HTML, CSS, PHP, JS e Google Maps API.",
    "portfolio.seeProject": "Ver Projeto",
    "portfolio.lf.title": "LF Consultoria — Análise Documental com IA",
    "portfolio.lf.description":
      "Sistema corporativo com inteligência artificial para apoiar consultores na análise de conformidade documental (OEA, LGPD), desenvolvido durante minha atuação como Analista de Segurança da Informação.<br/>Ferramentas: React, Node.js, IA, PostgreSQL.",
    "portfolio.seeScreens": "Ver Telas",
    "portfolio.inProgress": "Em andamento",
    "portfolio.presenca.title": "Sistema de Controle de Presença — UNISANTA",
    "portfolio.presenca.description":
      "Sistema institucional para registro de presença de alunos em eventos da UNISANTA, aprovado pela Diretoria da universidade.<br/>Ferramentas: Next.js, Supabase, TypeScript.",
    "portfolio.jogos.title": "Jogos Universitários — UNISANTA",
    "portfolio.jogos.description":
      "Plataforma de acompanhamento dos Jogos Universitários da UNISANTA: agenda de partidas, classificação, destaques e estatísticas.<br/>Ferramentas: Next.js, Supabase, TypeScript.",
    "portfolio.financas.title": "Finanças Pessoais",
    "portfolio.financas.description":
      "Aplicativo completo de finanças pessoais: contas e cartões, lançamentos, orçamento mensal por categoria, contas recorrentes e metas de economia.<br/>Ferramentas: Next.js, Supabase, TypeScript.",
    "portfolio.marketplace.title": "Marketplace",
    "portfolio.marketplace.description":
      "Marketplace multi-vendedor completo: carrinho, checkout, cupons, pedidos, painel administrativo, frete e pagamentos (Mercado Pago, Stripe, Pix).<br/>Ferramentas: Next.js, Supabase, TypeScript.",

    "activities.title": "Atividades Complementares",
    "activities.subtitle": "Além da sala de aula",
    "activities.watchVideo": "Assistir vídeo",
    "activities.hackathon.title": "1º Lugar — Hackathon Zoho Brasil",
    "activities.hackathon.description":
      "Conquista do 1º lugar no Hackathon promovido pela Zoho Brasil com uma solução de controle de presença por biometria facial e geolocalização, validando identidade e localização dos participantes em tempo real.",
    "activities.unisanta.title": "Sistemas Institucionais na UNISANTA",
    "activities.unisanta.description":
      "Desenvolvimento de dois sistemas propostos em sala de aula e aprovados pela Diretoria da UNISANTA: um Sistema de Controle de Presença e um Sistema de Acompanhamento dos Jogos Universitários.",
    "activities.scholarship.title": "Bolsa Integral por Projeto de Inovação",
    "activities.scholarship.description":
      "Idealização do jogo Save the Sea, voltado à conscientização sobre poluição marinha, o que rendeu uma bolsa de estudos integral (100%) na UNISANTA para o curso de Sistemas de Informação.",
    "activities.tcc.title": "TCC de Destaque Regional",
    "activities.tcc.description":
      "Liderança no TCC reconhecido como destaque na Baixada Santista: uma plataforma web para monitoramento de furtos e roubos, com apoio institucional e patrocínio do CONSEG e da ACE.",

    "contact.title": "Fale Comigo",
    "contact.subtitle": "Entre em contato",
    "contact.call": "Ligue",
    "contact.location": "Localização",

    "footer.subtitle": "Desenvolvedor Full Stack",
    "footer.portfolio": "Portfólio",
    "footer.activities": "Atividades",
    "footer.contact": "Contato",
    "footer.copy": " Copyright © 2026 Leonardo Navasconi. Todos os direitos reservados.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.portfolio": "Portfolio",
    "nav.activities": "Activities",
    "nav.contact": "Contact",

    "home.title": "Hi, I'm Leo",
    "home.subtitle": "Full Stack Developer &amp; Information Security Analyst",
    "home.description":
      "Full Stack Developer and Information Security Analyst, experienced in web applications, corporate automation, artificial intelligence and cybersecurity.",
    "home.contact": "Contact Me",
    "home.scroll": "Scroll down",

    "about.title": "About Me",
    "about.subtitle": "My introduction",
    "about.description":
      "Full Stack Developer and Information Security Analyst, experienced in building web applications, corporate automation, artificial intelligence and cybersecurity. I also work in information security consulting, access management and compliance for certifications such as OEA, contributing to data protection and companies' operational efficiency.",
    "about.info1Name": "Years of<br/>experience",
    "about.info2Name": "Completed<br/>projects",
    "about.info3Name": "Companies<br/>worked at",
    "about.downloadCV": "Download CV",

    "skills.title": "Skills",
    "skills.subtitle": "My technical level",
    "skills.backend.title": "Backend Development",
    "skills.backend.subtitle": "More than 3 years",
    "skills.frontend.title": "Frontend Development",
    "skills.frontend.subtitle": "More than 3 years",
    "skills.data.title": "Databases &amp; Cloud",
    "skills.data.subtitle": "More than 2 years",
    "skills.security.title": "Information Security",
    "skills.security.subtitle": "More than 1 year",
    "skills.security.item1": "Cybersecurity",
    "skills.security.item2": "Access Management (IAM)",
    "skills.security.item3": "Compliance &amp; OEA",
    "skills.security.item4": "Data Protection (LGPD)",
    "skills.security.item5": "Risk Management",
    "skills.automation.title": "Automation &amp; Productivity",
    "skills.automation.subtitle": "More than 3 years",

    "qualification.title": "Qualification",
    "qualification.subtitle": "My journey",
    "qualification.tabEducation": "Education",
    "qualification.tabWork": "Work",
    "qualification.edu1.title": "Advanced English",
    "qualification.edu2.title": "Computer Technician",
    "qualification.edu3.title": "B.A. in Information Systems",
    "qualification.edu4.title": "Full Stack Development",
    "qualification.work1.title": "IT Intern",
    "qualification.work1.subtitle": "Logic Minds - Brazil",
    "qualification.work2.title": "IT Intern | Automation &amp; Development",
    "qualification.work2.subtitle": "LF Auditoria e Consultoria - Brazil",
    "qualification.work3.title": "Information Security Analyst",
    "qualification.work3.subtitle": "LF Auditoria e Consultoria - Brazil",
    "qualification.work3.dates": "07/2025 - Present",

    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Most recent work",
    "portfolio.arhus.description":
      "System to report and visualize thefts and robberies through an interactive map. Award-winning senior thesis, recognized as a regional highlight with institutional support from CONSEG and ACE.<br/>Tools: HTML, CSS, PHP, JS and Google Maps API.",
    "portfolio.seeProject": "See Project",
    "portfolio.lf.title": "LF Consultoria — AI Document Analysis",
    "portfolio.lf.description":
      "Corporate system powered by artificial intelligence to support consultants in document compliance analysis (OEA, LGPD), built during my role as Information Security Analyst.<br/>Tools: React, Node.js, AI, PostgreSQL.",
    "portfolio.seeScreens": "View Screens",
    "portfolio.inProgress": "In progress",
    "portfolio.presenca.title": "Attendance Control System — UNISANTA",
    "portfolio.presenca.description":
      "Institutional system to register student attendance at UNISANTA events, approved by the university's board.<br/>Tools: Next.js, Supabase, TypeScript.",
    "portfolio.jogos.title": "University Games — UNISANTA",
    "portfolio.jogos.description":
      "Tracking platform for UNISANTA's University Games: match schedule, standings, highlights and stats.<br/>Tools: Next.js, Supabase, TypeScript.",
    "portfolio.financas.title": "Personal Finance",
    "portfolio.financas.description":
      "Complete personal finance app: accounts and cards, transactions, monthly budget per category, recurring bills and savings goals.<br/>Tools: Next.js, Supabase, TypeScript.",
    "portfolio.marketplace.title": "Marketplace",
    "portfolio.marketplace.description":
      "Full multi-vendor marketplace: cart, checkout, coupons, orders, admin panel, shipping and payments (Mercado Pago, Stripe, Pix).<br/>Tools: Next.js, Supabase, TypeScript.",

    "activities.title": "Complementary Activities",
    "activities.subtitle": "Beyond the classroom",
    "activities.watchVideo": "Watch video",
    "activities.hackathon.title": "1st Place — Zoho Brazil Hackathon",
    "activities.hackathon.description":
      "1st place win at the Hackathon promoted by Zoho Brazil with an attendance-control solution using facial biometrics and geolocation, validating participants' identity and location in real time.",
    "activities.unisanta.title": "Institutional Systems at UNISANTA",
    "activities.unisanta.description":
      "Development of two systems proposed in class and approved by UNISANTA's board: an Attendance Control System and a University Games Tracking System.",
    "activities.scholarship.title": "Full Scholarship for Innovation Project",
    "activities.scholarship.description":
      "Creator of the game Save the Sea, focused on raising awareness about marine pollution, which earned a full (100%) scholarship at UNISANTA for the Information Systems program.",
    "activities.tcc.title": "Regionally Recognized Senior Thesis",
    "activities.tcc.description":
      "Led the senior thesis recognized as a highlight in the Baixada Santista region: a web platform for monitoring thefts and robberies, with institutional support and sponsorship from CONSEG and ACE.",

    "contact.title": "Contact Me",
    "contact.subtitle": "Get in touch",
    "contact.call": "Call Me",
    "contact.location": "Location",

    "footer.subtitle": "Full Stack Developer",
    "footer.portfolio": "Portfolio",
    "footer.activities": "Activities",
    "footer.contact": "Contact",
    "footer.copy": " Copyright © 2026 Leonardo Navasconi. All Rights Reserved.",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Sobre mí",
    "nav.skills": "Habilidades",
    "nav.portfolio": "Portafolio",
    "nav.activities": "Actividades",
    "nav.contact": "Contacto",

    "home.title": "Hola, soy Leo",
    "home.subtitle": "Desarrollador Full Stack y Analista de Seguridad de la Información",
    "home.description":
      "Desarrollador Full Stack y Analista de Seguridad de la Información, con experiencia en aplicaciones web, automatización corporativa, inteligencia artificial y ciberseguridad.",
    "home.contact": "Contáctame",
    "home.scroll": "Desplázate hacia abajo",

    "about.title": "Sobre Mí",
    "about.subtitle": "Mi introducción",
    "about.description":
      "Desarrollador Full Stack y Analista de Seguridad de la Información, con experiencia en el desarrollo de aplicaciones web, automatización corporativa, inteligencia artificial y ciberseguridad. También trabajo en consultoría de seguridad de la información, gestión de accesos y cumplimiento para certificaciones como OEA, contribuyendo a la protección de datos y la eficiencia operativa de las empresas.",
    "about.info1Name": "Años de<br/>experiencia",
    "about.info2Name": "Proyectos<br/>completados",
    "about.info3Name": "Empresas<br/>en las que trabajé",
    "about.downloadCV": "Descargar CV",

    "skills.title": "Habilidades",
    "skills.subtitle": "Mi nivel técnico",
    "skills.backend.title": "Desarrollo Backend",
    "skills.backend.subtitle": "Más de 3 años",
    "skills.frontend.title": "Desarrollo Frontend",
    "skills.frontend.subtitle": "Más de 3 años",
    "skills.data.title": "Bases de Datos &amp; Nube",
    "skills.data.subtitle": "Más de 2 años",
    "skills.security.title": "Seguridad de la Información",
    "skills.security.subtitle": "Más de 1 año",
    "skills.security.item1": "Ciberseguridad",
    "skills.security.item2": "Gestión de Accesos (IAM)",
    "skills.security.item3": "Cumplimiento &amp; OEA",
    "skills.security.item4": "Protección de Datos (LGPD)",
    "skills.security.item5": "Gestión de Riesgos",
    "skills.automation.title": "Automatización &amp; Productividad",
    "skills.automation.subtitle": "Más de 3 años",

    "qualification.title": "Calificación",
    "qualification.subtitle": "Mi trayectoria",
    "qualification.tabEducation": "Educación",
    "qualification.tabWork": "Experiencia",
    "qualification.edu1.title": "Inglés Avanzado",
    "qualification.edu2.title": "Técnico en Informática",
    "qualification.edu3.title": "Licenciatura en Sistemas de Información",
    "qualification.edu4.title": "Desarrollo Full Stack",
    "qualification.work1.title": "Pasante de TI",
    "qualification.work1.subtitle": "Logic Minds - Brasil",
    "qualification.work2.title": "Pasante de TI | Automatización y Desarrollo",
    "qualification.work2.subtitle": "LF Auditoria e Consultoria - Brasil",
    "qualification.work3.title": "Analista de Seguridad de la Información",
    "qualification.work3.subtitle": "LF Auditoria e Consultoria - Brasil",
    "qualification.work3.dates": "07/2025 - Actualidad",

    "portfolio.title": "Portafolio",
    "portfolio.subtitle": "Trabajos recientes",
    "portfolio.arhus.description":
      "Sistema para registrar y visualizar hurtos y robos mediante un mapa interactivo. Proyecto de fin de carrera premiado, reconocido como destacado regional con apoyo institucional de CONSEG y ACE.<br/>Herramientas: HTML, CSS, PHP, JS y Google Maps API.",
    "portfolio.seeProject": "Ver Proyecto",
    "portfolio.lf.title": "LF Consultoria — Análisis Documental con IA",
    "portfolio.lf.description":
      "Sistema corporativo con inteligencia artificial para apoyar a los consultores en el análisis de cumplimiento documental (OEA, LGPD), desarrollado durante mi actuación como Analista de Seguridad de la Información.<br/>Herramientas: React, Node.js, IA, PostgreSQL.",
    "portfolio.seeScreens": "Ver Pantallas",
    "portfolio.inProgress": "En progreso",
    "portfolio.presenca.title": "Sistema de Control de Asistencia — UNISANTA",
    "portfolio.presenca.description":
      "Sistema institucional para registrar la asistencia de los alumnos en eventos de la UNISANTA, aprobado por la Dirección de la universidad.<br/>Herramientas: Next.js, Supabase, TypeScript.",
    "portfolio.jogos.title": "Juegos Universitarios — UNISANTA",
    "portfolio.jogos.description":
      "Plataforma de seguimiento de los Juegos Universitarios de la UNISANTA: calendario de partidos, clasificación, destacados y estadísticas.<br/>Herramientas: Next.js, Supabase, TypeScript.",
    "portfolio.financas.title": "Finanzas Personales",
    "portfolio.financas.description":
      "Aplicación completa de finanzas personales: cuentas y tarjetas, movimientos, presupuesto mensual por categoría, gastos recurrentes y metas de ahorro.<br/>Herramientas: Next.js, Supabase, TypeScript.",
    "portfolio.marketplace.title": "Marketplace",
    "portfolio.marketplace.description":
      "Marketplace multi-vendedor completo: carrito, checkout, cupones, pedidos, panel administrativo, envíos y pagos (Mercado Pago, Stripe, Pix).<br/>Herramientas: Next.js, Supabase, TypeScript.",

    "activities.title": "Actividades Complementarias",
    "activities.subtitle": "Más allá del aula",
    "activities.watchVideo": "Ver video",
    "activities.hackathon.title": "1er Lugar — Hackathon de Zoho Brasil",
    "activities.hackathon.description":
      "Logro del 1er lugar en el Hackathon promovido por Zoho Brasil con una solución de control de asistencia mediante biometría facial y geolocalización, validando la identidad y ubicación de los participantes en tiempo real.",
    "activities.unisanta.title": "Sistemas Institucionales en la UNISANTA",
    "activities.unisanta.description":
      "Desarrollo de dos sistemas propuestos en el aula y aprobados por la Dirección de la UNISANTA: un Sistema de Control de Asistencia y un Sistema de Seguimiento de los Juegos Universitarios.",
    "activities.scholarship.title": "Beca Integral por Proyecto de Innovación",
    "activities.scholarship.description":
      "Creación del juego Save the Sea, enfocado en la concientización sobre la contaminación marina, lo que le valió una beca integral (100%) en la UNISANTA para la carrera de Sistemas de Información.",
    "activities.tcc.title": "Proyecto de Fin de Carrera Destacado Regional",
    "activities.tcc.description":
      "Liderazgo en el proyecto de fin de carrera reconocido como destacado en la Baixada Santista: una plataforma web para el monitoreo de hurtos y robos, con apoyo institucional y patrocinio de CONSEG y ACE.",

    "contact.title": "Contáctame",
    "contact.subtitle": "Ponte en contacto",
    "contact.call": "Llámame",
    "contact.location": "Ubicación",

    "footer.subtitle": "Desarrollador Full Stack",
    "footer.portfolio": "Portafolio",
    "footer.activities": "Actividades",
    "footer.contact": "Contacto",
    "footer.copy": " Copyright © 2026 Leonardo Navasconi. Todos los derechos reservados.",
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function PortfolioI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem("nv-selected-lang") as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("nv-selected-lang", next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => translations[lang][key] ?? translations.pt[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function usePortfolioI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("usePortfolioI18n must be used within PortfolioI18nProvider");
  return ctx;
}
