import Link from "next/link";
import { BookOpen, Database, Table2, Zap, Star, Lightbulb, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

const SECTIONS = [
  {
    Icon: Database,
    title: "DDL — Data Definition Language",
    desc: "DDL задачите бараат да креираш табели со правилни колони, типови и constraints (PRIMARY KEY, NOT NULL, UNIQUE, FOREIGN KEY). Платформата автоматски проверува дали табелата е точно дефинирана.",
    example: "CREATE TABLE students (\n  id    SERIAL PRIMARY KEY,\n  name  TEXT NOT NULL,\n  year  INTEGER\n);",
  },
  {
    Icon: Table2,
    title: "DML — Data Manipulation Language",
    desc: "DML задачите бараат SELECT прашалници — филтрирање, групирање, JOIN-ови, subqueries. Твојот резултат се споредува со очекуваниот ред по ред.",
    example: "SELECT name, COUNT(*) AS задачи\nFROM students\nGROUP BY name\nORDER BY задачи DESC;",
  },
  {
    Icon: Zap,
    title: "Тригери",
    desc: "Тригер задачите бараат да напишеш FUNCTION и TRIGGER кој автоматски се извршува при INSERT, UPDATE или DELETE. Тестирани се со реални сценарија.",
    example: "CREATE OR REPLACE FUNCTION my_fn()\nRETURNS TRIGGER AS $$\nBEGIN\n  -- логика\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
  },
];

export default function GuidePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <BookOpen size={28} strokeWidth={1.5} className={styles.heroIcon} />
        <h1 className={styles.heroTitle}>Водич за почетници</h1>
        <p className={styles.heroSub}>Сè што треба да знаеш за да почнеш со вежбање на SQLab FINKI.</p>
      </div>

      <div className={styles.howSection}>
        <h2 className={styles.sectionTitle}>Како функционира платформата?</h2>
        <div className={styles.stepList}>
          {[
            { n: "1", text: "Избери категорија (DDL, DML или Trigger) и тежина на задача." },
            { n: "2", text: "Прочитај ја задачата и напиши го SQL кодот во едиторот." },
            { n: "3", text: 'Притисни „Провери код" — резултатот се споредува веднаш во browser-от.' },
            { n: "4", text: "Ако не успееш, користи ги Советите (hints) — секој hint носи мала казна на поените." },
            { n: "5", text: "Кога ќе завршиш, погледни го Walkthrough за да го разбереш решението." },
          ].map(({ n, text }) => (
            <div key={n} className={styles.step}>
              <span className={styles.stepNum}>{n}</span>
              <p className={styles.stepText}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.catSection}>
        <h2 className={styles.sectionTitle}>Типови задачи</h2>
        <div className={styles.catGrid}>
          {SECTIONS.map(({ Icon, title, desc, example }) => (
            <div key={title} className={styles.catCard}>
              <div className={styles.catTop}>
                <div className={styles.catIcon}><Icon size={18} strokeWidth={1.8} /></div>
                <h3 className={styles.catTitle}>{title}</h3>
              </div>
              <p className={styles.catDesc}>{desc}</p>
              <pre className={styles.codeBlock}>{example}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tipsSection}>
        <h2 className={styles.sectionTitle}>Совети</h2>
        <div className={styles.tipList}>
          {[
            { Icon: Star,         text: "Почни со задачи со тежина ★☆☆☆☆ пред да одиш на потешки." },
            { Icon: Lightbulb,    text: "Hints се достапни ако заглавиш — но носат казна од 10–20%." },
            { Icon: CheckCircle,  text: "Поените се пресметуваат врз основа на точноста и бројот на искористени hints." },
          ].map(({ Icon, text }, i) => (
            <div key={i} className={styles.tip}>
              <Icon size={16} strokeWidth={1.8} className={styles.tipIcon} />
              <p className={styles.tipText}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/dml" className={styles.startBtn}>Започни со DML задачи →</Link>
        <Link href="/faq" className={styles.faqLink}>Прашања? Погледни го FAQ</Link>
      </div>
    </div>
  );
}
