import Link from "next/link";
import Nav from "@/components/Nav";
import styles from "./page.module.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "Тренирај со вистински задачи",
    body: "Задачи покриваат DDL, DML, тригери, ER дијаграми и релациска шема — исто како на испитот.",
  },
  {
    icon: "✓",
    title: "Автоматско оценување",
    body: "Твојот SQL се извршува директно во прелистувачот. Резултатот се споредува со точниот одговор — без рачна проверка.",
  },
  {
    icon: "💡",
    title: "Совети по нивоа",
    body: "Заглавен? Откријте совети чекор по чекор — секој совет малку го намалува максималниот резултат, за да размислуваш прво.",
  },
  {
    icon: "📋",
    title: "Упатство за решавање",
    body: "По секој обид добиваш детално упатство кое ја објаснува логиката на решението, не само одговорот.",
  },
];

const CATEGORIES = [
  { label: "DML", desc: "SELECT, JOIN, GROUP BY, подупити" },
  { label: "DDL", desc: "CREATE TABLE, клучеви, ограничувања" },
  { label: "Тригери", desc: "BEFORE / AFTER, состојбено тестирање" },
  { label: "ER дијаграм", desc: "Ентитети, атрибути, кардиналност" },
  { label: "Релации", desc: "Претворање на ER во релациска шема" },
];

export default function LandingPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>ФИНКИ — Бази на Податоци 1</span>
          <h1 className={styles.heroTitle}>
            Вежбај за практичниот испит.<br />Добивај повратна информација веднаш.
          </h1>
          <p className={styles.heroSub}>
            Платформа за вежбање SQL задачи со автоматско оценување, совети и упатства —
            за студентите на ФИНКИ.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Започни бесплатно
            </Link>
            <Link href="/login" className={styles.ctaSecondary}>
              Веќе имам профил
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Зошто FINKI DB Prep?</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Теми од испитот</h2>
          <div className={styles.categoryList}>
            {CATEGORIES.map((c) => (
              <div key={c.label} className={styles.categoryItem}>
                <span className={styles.categoryLabel}>{c.label}</span>
                <span className={styles.categoryDesc}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <h2 className={styles.ctaBannerTitle}>Подготви се за испитот</h2>
          <p className={styles.ctaBannerSub}>
            Регистрирај се и почни да решаваш задачи веднаш.
          </p>
          <Link href="/signup" className={styles.ctaPrimary}>
            Регистрирај се
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} FINKI DB Prep</p>
      </footer>
    </>
  );
}
