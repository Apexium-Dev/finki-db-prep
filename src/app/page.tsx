"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Zap, Target, TrendingUp, Lightbulb,
  Database, Table2, Cpu, GitBranch,
  Trophy, Diamond, Languages,
} from "lucide-react";
import styles from "./page.module.css";

const COPY = {
  en: {
    navFeatures: "Features",
    navModules: "Modules",
    navLogin: "Log in",
    navStart: "Get started →",
    heroLine1: "Master",
    heroLine2: "databases",
    heroSub: "Practice SQL in the browser, get instant feedback, and prepare for the practical exam. Everything in one place.",
    ctaPrimary: "Start for free",
    ctaGhost: "Explore modules",
    resultText: "Correct! · 24 rows · 0.04ms ·",
    resultPoints: "100 points",
    floatTitle: "Top score",
    floatSub: "1,240 pts",
    eyebrow1: "Why SQLab FINKI",
    section1: "Everything you need for the exam",
    eyebrow2: "Practice modules",
    section2: "Every aspect of the exam",
    ctaTitle: "Ready for the exam?",
    ctaSub: "Sign up and start solving tasks right now. Free, no installation needed.",
    ctaBig: "Create a free account",
    footerCopy: "FINKI Skopje",
    moduleArrow: "Start module →",
  },
  mk: {
    navFeatures: "Карактеристики",
    navModules: "Модули",
    navLogin: "Најава",
    navStart: "Започни →",
    heroLine1: "Совладај ги",
    heroLine2: "базите на податоци",
    heroSub: "Вежбај SQL во прелистувачот, добивај повратна информација веднаш и подготви се за практичниот испит. Се на едно место.",
    ctaPrimary: "Започни бесплатно",
    ctaGhost: "Разгледај модули",
    resultText: "Точно! · 24 редови · 0.04ms ·",
    resultPoints: "100 поени",
    floatTitle: "Врвен резултат",
    floatSub: "1,240 поени",
    eyebrow1: "Зошто SQLab FINKI",
    section1: "Се што ти треба за испитот",
    eyebrow2: "Модули за вежбање",
    section2: "Секој аспект од испитот",
    ctaTitle: "Подготвен за испитот?",
    ctaSub: "Регистрирај се и почни да решаваш задачи веднаш. Бесплатно, без инсталација.",
    ctaBig: "Создај профил бесплатно",
    footerCopy: "ФИНКИ Скопjе",
    moduleArrow: "Започни →",
  },
};

const FEATURES = {
  en: [
    { Icon: Zap,       title: "Instant Feedback",           body: "Your SQL runs directly in the browser via PGlite. Results in milliseconds, no server required." },
    { Icon: Target,    title: "Precise Error Explanations",  body: "Every wrong answer comes with a concrete explanation. Not just incorrect, but why and where." },
    { Icon: TrendingUp,title: "Measurable Progress",         body: "Leaderboard, points, and per-category stats. Track your improvement toward the exam." },
    { Icon: Lightbulb, title: "Tiered Hints",                body: "Stuck? Unlock hints step by step that guide you toward the solution without giving it away." },
  ],
  mk: [
    { Icon: Zap,       title: "Инстант проверка",            body: "Вашиот SQL се извршува директно во прелистувачот преку PGlite. Резултатот го добивате за милисекунди, без сервер." },
    { Icon: Target,    title: "Прецизна повратна информација",body: "За секоја грешка добивате конкретно објаснување. Не само непоточно, туку зошто и каде." },
    { Icon: TrendingUp,title: "Прогрес кој се мери",          body: "Лидерборд, поени и статистика по категорија. Следете го вашиот напредок кон испитот." },
    { Icon: Lightbulb, title: "Совети по нивоа",              body: "Заглавени? Откријте совети чекор по чекор кои ве водат кон решението без да го откријат." },
  ],
};

const MODULES = {
  en: [
    { Icon: Table2,    label: "DML",      title: "Data Manipulation",  body: "SELECT · JOIN · GROUP BY · Subqueries",                  color: "blue" },
    { Icon: Database,  label: "DDL",      title: "Schema Design",      body: "CREATE TABLE · PRIMARY KEY · FOREIGN KEY",               color: "teal" },
    { Icon: Cpu,       label: "Triggers", title: "Trigger Automation", body: "BEFORE / AFTER · PL/pgSQL · State-based testing",        color: "red"  },
    { Icon: GitBranch, label: "ER",       title: "ER Diagrams",        body: "Entities · Relationships · Cardinality · Weak entities", color: "teal" },
  ],
  mk: [
    { Icon: Table2,    label: "DML",      title: "Манипулација со податоци", body: "SELECT · JOIN · GROUP BY · Подупрашувања",            color: "blue" },
    { Icon: Database,  label: "DDL",      title: "Дефинирање на шема",       body: "CREATE TABLE · PRIMARY KEY · FOREIGN KEY",            color: "teal" },
    { Icon: Cpu,       label: "Тригери",  title: "Автоматизација со тригери",body: "BEFORE / AFTER · PL/pgSQL · Состојбено тестирање",    color: "red"  },
    { Icon: GitBranch, label: "ER",       title: "ER дијаграми",             body: "Ентитети · Врски · Кардиналност · Слаби ентитети",    color: "teal" },
  ],
};

const CODE_LINES = [
  { tokens: [{ t: "SELECT",   k: "kw" }, { t: " s.name, d.name AS dept",  k: "txt" }] },
  { tokens: [{ t: "FROM",     k: "kw" }, { t: " students s",              k: "txt" }] },
  { tokens: [{ t: "JOIN",     k: "kw" }, { t: " departments d ", k: "txt" }, { t: "ON", k: "kw" }, { t: " s.dept_id = d.id", k: "txt" }] },
  { tokens: [{ t: "WHERE",    k: "kw" }, { t: " s.year = ",      k: "txt" }, { t: "3",  k: "num" }] },
  { tokens: [{ t: "ORDER BY", k: "kw" }, { t: " s.name",         k: "txt" }] },
];

type Lang = "en" | "mk";

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("sqlab_lang") as Lang | null;
    if (saved === "en" || saved === "mk") setLang(saved);
  }, []);

  function toggleLang() {
    const next: Lang = lang === "en" ? "mk" : "en";
    setLang(next);
    localStorage.setItem("sqlab_lang", next);
  }

  const c = COPY[lang];
  const features = FEATURES[lang];
  const modules = MODULES[lang];

  return (
    <div className={styles.root}>

      {/* Nav */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <Diamond size={16} className={styles.navLogoIcon} strokeWidth={2.5} />
            SQLab FINKI
          </Link>
          <nav className={styles.navCenter}>
            <a href="#features" className={styles.navLink}>{c.navFeatures}</a>
            <a href="#modules"  className={styles.navLink}>{c.navModules}</a>
          </nav>
          <div className={styles.navRight}>
            <button onClick={toggleLang} className={styles.langBtn} title="Switch language">
              <Languages size={15} strokeWidth={2} />
              {lang === "en" ? "MK" : "EN"}
            </button>
            <Link href="/login"  className={styles.navLoginBtn}>{c.navLogin}</Link>
            <Link href="/signup" className={styles.navSignupBtn}>{c.navStart}</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}  aria-hidden />
        <div className={styles.heroGlow1} aria-hidden />
        <div className={styles.heroGlow2} aria-hidden />

        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            {c.heroLine1}<br />
            <span className={styles.heroAccent}>{c.heroLine2}</span>
          </h1>

          <p className={styles.heroSub}>{c.heroSub}</p>

          <div className={styles.heroCtas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              {c.ctaPrimary}
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <a href="#modules" className={styles.ctaGhost}>{c.ctaGhost}</a>
          </div>

          {/* Code card */}
          <div className={styles.heroCardWrap}>
            <div className={styles.heroCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDots}>
                  <span className={styles.dot} style={{ background: "#ff5f57" }} />
                  <span className={styles.dot} style={{ background: "#ffbd2e" }} />
                  <span className={styles.dot} style={{ background: "#28ca41" }} />
                </div>
                <span className={styles.cardTitle}>query.sql</span>
                <span className={styles.cardBadge}>Live</span>
              </div>

              <div className={styles.cardCode}>
                {CODE_LINES.map((line, i) => (
                  <div key={i} className={styles.codeLine} style={{ animationDelay: `${i * 0.12}s` }}>
                    <span className={styles.lineNum}>{i + 1}</span>
                    <span>{line.tokens.map((tok, j) => <span key={j} className={styles[tok.k]}>{tok.t}</span>)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.cardResult}>
                <span className={styles.resultIcon}>✓</span>
                <span className={styles.resultText}>
                  {c.resultText} <strong>{c.resultPoints}</strong>
                </span>
              </div>
            </div>

            <div className={styles.floatBadge}>
              <Trophy size={22} className={styles.floatTrophyIcon} strokeWidth={1.8} />
              <div>
                <p className={styles.floatTitle}>{c.floatTitle}</p>
                <p className={styles.floatSub}>{c.floatSub}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <p className={styles.eyebrow}>{c.eyebrow1}</p>
          <h2 className={styles.sectionTitle}>{c.section1}</h2>
          <div className={styles.featureGrid}>
            {features.map(({ Icon, title, body }, i) => (
              <div key={title} className={styles.featureCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.featureIconWrap}>
                  <Icon size={20} strokeWidth={1.8} className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureBody}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className={styles.modules} id="modules">
        <div className={styles.container}>
          <p className={styles.eyebrow}>{c.eyebrow2}</p>
          <h2 className={styles.sectionTitle}>{c.section2}</h2>
          <div className={styles.moduleGrid}>
            {modules.map(({ Icon, label, title, body, color }) => (
              <Link key={label} href="/signup" className={`${styles.moduleCard} ${styles[`mod_${color}`]}`}>
                <div className={styles.moduleLabelRow}>
                  <Icon size={15} strokeWidth={2} />
                  <span className={styles.moduleLabel}>{label}</span>
                </div>
                <h3 className={styles.moduleTitle}>{title}</h3>
                <p className={styles.moduleBody}>{body}</p>
                <span className={styles.moduleArrow}>{c.moduleArrow}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} aria-hidden />
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
          <p className={styles.ctaSub}>{c.ctaSub}</p>
          <Link href="/signup" className={styles.ctaBig}>{c.ctaBig}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>
            <Diamond size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            SQLab FINKI
          </span>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} SQLab FINKI · {c.footerCopy}</p>
        </div>
      </footer>

    </div>
  );
}
