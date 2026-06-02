import Link from "next/link";
import styles from "./page.module.css";

const FEATURES = [
  {
    icon: "dns",
    title: "WASM Бази",
    body: "Извршување на комплексни прашалници директно во вашиот прелистувач преку PGlite технологија. Нема потреба од инсталација на локален сервер.",
  },
  {
    icon: "bolt",
    title: "Инстант Проверка",
    body: "Веднаш дознајте дали вашиот прашалник е точен. Автоматизираниот систем ги споредува вашите резултати со референтните решенија.",
  },
  {
    icon: "menu_book",
    title: "Поддршка за Испит",
    body: "Сценаријата и податочните множества се директно усогласени со курикулумот по предметот Бази на податоци 1 на ФИНКИ.",
  },
];

const MODULES = [
  {
    icon: "architecture",
    title: "DDL (Дефинирање)",
    body: "Креирање маси, дефинирање на примарни и странични клучеви, ограничувања и структурирање на податочниот модел.",
    large: true,
    category: "ddl",
  },
  {
    icon: "table_chart",
    title: "DML (Манипулација)",
    body: "Пишување комплексни SELECT прашалници, JOIN операции, групирање и филтрирање на податоци.",
    large: false,
    category: "dml",
  },
  {
    icon: "bolt",
    title: "Тригери (Triggers)",
    body: "Автоматизација на логика преку PL/pgSQL. Тригери, функции и одржување на интегритетот на податоците.",
    large: false,
    category: "trigger",
  },
  {
    icon: "account_tree",
    title: "ER Дијаграми",
    body: "Трансформирање на бизнис барања во концептуални и логички модели. Мапирање на ентитети и врски.",
    large: false,
    category: "er",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Nav ── */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.navLogo}>SQLab FINKI</span>
          <nav className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#modules" className={styles.navLink}>Modules</a>
          </nav>
          <Link href="/login" className={styles.navBtn}>Login</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroDots} aria-hidden />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className={`material-symbols-outlined ${styles.badgeIcon}`}>school</span>
              Официјална алатка за Бази на податоци 1
            </div>
            <h1 className={styles.heroTitle}>
              Совладај ги <span className={styles.heroAccent}>базите на податоци</span>
            </h1>
            <p className={styles.heroSub}>
              Врвна интерактивна платформа за студентите на ФИНКИ. Вежбајте SQL прашалници,
              дизајнирајте шеми и подгответе се за испитот преку практични сценарија.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/signup" className={styles.ctaPrimary}>Започни со вежбање</Link>
              <a href="#modules" className={styles.ctaSecondary}>Разгледај модули</a>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardBg} aria-hidden />
            <div className={styles.glassPanel}>
              <div className={styles.glassPanelHeader}>
                <span className={styles.glassPanelCode}>SELECT * FROM students;</span>
                <span className={`material-symbols-outlined ${styles.glassPanelPlay}`}>play_arrow</span>
              </div>
              <div className={styles.glassPanelResult}>
                &gt; Query executed in 0.04ms<br />
                &gt; 24 rows returned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Зошто SQLab FINKI?</h2>
            <p className={styles.sectionSub}>
              Наменски дизајнирана платформа за елиминирање на техничките пречки и фокусирање на логиката.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <span className={`material-symbols-outlined ${styles.featureIcon}`}>{f.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className={styles.modules} id="modules">
        <div className={styles.container}>
          <div className={styles.modulesHead}>
            <h2 className={styles.sectionTitle}>Модули за Вежбање</h2>
            <p className={styles.sectionSub}>Структуриран пристап кон совладување на секој аспект од релационите бази.</p>
          </div>
          <div className={styles.bentoGrid}>
            {MODULES.map((m) => (
              <Link
                key={m.title}
                href={`/login`}
                className={`${styles.bentoCard} ${m.large ? styles.bentoLarge : ""}`}
              >
                <div className={styles.bentoBg} aria-hidden>
                  <span className={`material-symbols-outlined ${styles.bentoBgIcon}`}>{m.icon}</span>
                </div>
                <div className={styles.bentoContent}>
                  <div>
                    <span className={`material-symbols-outlined ${styles.bentoIcon}`}>{m.icon}</span>
                    <h3 className={`${styles.bentoTitle} ${m.large ? styles.bentoTitleLg : ""}`}>{m.title}</h3>
                    <p className={styles.bentoBody}>{m.body}</p>
                  </div>
                  <span className={styles.bentoLink}>Започни модул →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Preview ── */}
      <section className={styles.preview}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} ${styles.centered}`}>Професионална работна околина</h2>
          <div className={styles.previewWindow}>
            <div className={styles.previewBar}>
              <div className={styles.previewDot} />
              <div className={styles.previewDot} />
              <div className={styles.previewDot} />
              <span className={styles.previewBarTitle}>sqlab-finki/workspace</span>
            </div>
            <div className={styles.previewBody}>
              <aside className={styles.previewSidebar}>
                <p className={styles.previewSidebarLabel}>Schema Explorer</p>
                <ul className={styles.previewTableList}>
                  {["employees", "departments", "salaries"].map((t) => (
                    <li key={t} className={styles.previewTableItem}>
                      <span className={`material-symbols-outlined ${styles.previewTableIcon}`}>table</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </aside>
              <div className={styles.previewEditor}>
                <div className={styles.previewCode}>
                  <span className={styles.kw}>SELECT</span> e.first_name, e.last_name, d.dept_name<br />
                  <span className={styles.kw}>FROM</span> employees e<br />
                  <span className={styles.kw}>JOIN</span> dept_emp de <span className={styles.kw}>ON</span> e.emp_no = de.emp_no<br />
                  <span className={styles.kw}>JOIN</span> departments d <span className={styles.kw}>ON</span> de.dept_no = d.dept_no<br />
                  <span className={styles.kw}>WHERE</span> d.dept_name = <span className={styles.str}>&apos;Engineering&apos;</span>;
                </div>
                <div className={styles.previewResults}>
                  <table className={styles.resultsTable}>
                    <thead>
                      <tr>
                        <th>first_name</th><th>last_name</th><th>dept_name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Gjorgji</td><td>Madjarov</td><td>Engineering</td></tr>
                      <tr><td>Petko</td><td>Petkovski</td><td>Engineering</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Подготвен за испитот?</h2>
          <p className={styles.ctaSub}>
            Не оставајте ништо на случајност. Придружете им се на стотици студенти кои веќе ја користат платформата.
          </p>
          <Link href="/signup" className={styles.ctaPrimaryDark}>Најави се</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>SQLab FINKI</span>
          <div className={styles.footerLinks}>
            <a href="#">Institutional Links</a>
            <a href="#">Project Credits</a>
            <a href="#">Contact Info</a>
          </div>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} SQLab FINKI. All rights reserved.</span>
        </div>
      </footer>

      {/* Material Symbols */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    </>
  );
}
