import Link from "next/link";
import {
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  Database,
  Table2,
  Cpu,
  GitBranch,
  Trophy,
  Diamond,
} from "lucide-react";
import styles from "./page.module.css";

const FEATURES = [
  {
    Icon: Zap,
    title: "Инстант проверка",
    body: "Вашиот SQL се извршува директно во прелистувачот преку PGlite. Резултатот го добивате за милисекунди — без сервер.",
  },
  {
    Icon: Target,
    title: "Прецизна повратна информација",
    body: "За секоја грешка добивате конкретно објаснување. Не само непоточно, туку зошто и каде.",
  },
  {
    Icon: TrendingUp,
    title: "Прогрес кој се мери",
    body: "Лидерборд, поени и статистика по категорија. Следете го вашиот напредок кон испитот.",
  },
  {
    Icon: Lightbulb,
    title: "Совети по нивоа",
    body: "Заглавени? Откријте совети чекор по чекор кои ве водат кон решението без да го откријат.",
  },
];

const MODULES = [
  { Icon: Table2,   label: "DML",     title: "Манипулација со податоци", body: "SELECT · JOIN · GROUP BY · Подупрашувања",                 color: "blue",   category: "dml" },
  { Icon: Database, label: "DDL",     title: "Дефинирање на шема",       body: "CREATE TABLE · PRIMARY KEY · FOREIGN KEY",                color: "teal",   category: "ddl" },
  { Icon: Cpu,      label: "Тригери", title: "Автоматизација со тригери", body: "BEFORE / AFTER · PL/pgSQL · Состојбено тестирање",       color: "red",    category: "trigger" },
  { Icon: GitBranch,label: "ER",      title: "ER дијаграми",             body: "Ентитети · Врски · Кардиналност · Слаби ентитети",        color: "teal",   category: "er" },
];

const CODE_LINES = [
  { tokens: [{ t: "SELECT", k: "kw" }, { t: " s.name, d.name AS dept", k: "txt" }] },
  { tokens: [{ t: "FROM",   k: "kw" }, { t: " students s",              k: "txt" }] },
  { tokens: [{ t: "JOIN",   k: "kw" }, { t: " departments d ", k: "txt" }, { t: "ON", k: "kw" }, { t: " s.dept_id = d.id", k: "txt" }] },
  { tokens: [{ t: "WHERE",  k: "kw" }, { t: " s.year = ",      k: "txt" }, { t: "3",  k: "num" }] },
  { tokens: [{ t: "ORDER BY", k: "kw" }, { t: " s.name",       k: "txt" }] },
];

export default function LandingPage() {
  return (
    <div className={styles.root}>

      {/* ── Nav ── */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <Diamond size={16} className={styles.navLogoIcon} strokeWidth={2.5} />
            SQLab FINKI
          </Link>
          <nav className={styles.navCenter}>
            <a href="#features" className={styles.navLink}>Карактеристики</a>
            <a href="#modules"  className={styles.navLink}>Модули</a>
          </nav>
          <div className={styles.navRight}>
            <Link href="/login"  className={styles.navLoginBtn}>Најава</Link>
            <Link href="/signup" className={styles.navSignupBtn}>Започни →</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}  aria-hidden />
        <div className={styles.heroGlow1} aria-hidden />
        <div className={styles.heroGlow2} aria-hidden />

        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Совладај ги<br />
            <span className={styles.heroAccent}>базите на податоци</span>
          </h1>

          <p className={styles.heroSub}>
            Вежбај SQL во прелистувачот, добивај повратна информација веднаш
            и подготви се за практичниот испит. Сe на едно место.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Започни бесплатно
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <a href="#modules" className={styles.ctaGhost}>Разгледај модули</a>
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
                    <span>
                      {line.tokens.map((tok, j) => (
                        <span key={j} className={styles[tok.k]}>{tok.t}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.cardResult}>
                <span className={styles.resultIcon}>✓</span>
                <span className={styles.resultText}>
                  Точно! · 24 редови · 0.04ms · <strong>100 поени</strong>
                </span>
              </div>
            </div>

            <div className={styles.floatBadge}>
              <Trophy size={22} className={styles.floatTrophyIcon} strokeWidth={1.8} />
              <div>
                <p className={styles.floatTitle}>Врвен резултат</p>
                <p className={styles.floatSub}>1,240 поени</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Зошто SQLab FINKI</p>
          <h2 className={styles.sectionTitle}>Се што ти треба за испитот</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map(({ Icon, title, body }, i) => (
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

      {/* ── Modules ── */}
      <section className={styles.modules} id="modules">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Модули за вежбање</p>
          <h2 className={styles.sectionTitle}>Секој аспект од испитот</h2>
          <div className={styles.moduleGrid}>
            {MODULES.map(({ Icon, label, title, body, color }) => (
              <Link key={label} href="/signup" className={`${styles.moduleCard} ${styles[`mod_${color}`]}`}>
                <div className={styles.moduleLabelRow}>
                  <Icon size={15} strokeWidth={2} />
                  <span className={styles.moduleLabel}>{label}</span>
                </div>
                <h3 className={styles.moduleTitle}>{title}</h3>
                <p className={styles.moduleBody}>{body}</p>
                <span className={styles.moduleArrow}>Започни →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} aria-hidden />
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Подготвен за испитот?</h2>
          <p className={styles.ctaSub}>
            Регистрирај се и почни да решаваш задачи веднаш.
            Бесплатно, без инсталација.
          </p>
          <Link href="/signup" className={styles.ctaBig}>
            Создај профил — бесплатно
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>
            <Diamond size={13} strokeWidth={2} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            SQLab FINKI
          </span>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} SQLab FINKI · ФИНКИ Скопjе</p>
        </div>
      </footer>

    </div>
  );
}
