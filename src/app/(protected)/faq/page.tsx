"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const FAQS = [
  {
    q: "Како се пресметуваат поените?",
    a: "Секоја задача носи одреден број поени. Ако одговорот е точен без hints — добиваш 100%. Секој hint носи казна (10–20%). Ако одговорот е делумно точен (DDL/Trigger), добиваш пропорционален дел.",
  },
  {
    q: "Дали моите одговори се чуваат?",
    a: "Да, секое поднесување (Submit) се зачувува во базата. Платформата памети кои задачи ги завршил и со кој резултат.",
  },
  {
    q: 'Зошто добивам „Неточно" иако мислам дека е точно?',
    a: 'Провери: (1) дали имаш ORDER BY ако задачата го бара, (2) дали имаш точни имиња на колоните (aliases), (3) дали типовите на податоци се совпаѓаат. Ако мислиш дека задачата е грешна — користи го копчето „Пријави" на страницата на задачата.',
  },
  {
    q: "Дали платформата работи со MySQL?",
    a: "Не — платформата е базирана на PostgreSQL. Синтаксата е ANSI SQL со PostgreSQL специфики (SERIAL, PL/pgSQL итн.).",
  },
  {
    q: "Каде можам да пријавам грешка во задача?",
    a: 'На страницата на задачата има копче „Пријави" горе десно. Можеш и да ни напишеш преку Контакт формата.',
  },
  {
    q: "Дали има мобилна апликација?",
    a: "Засега не — само web платформа. Сајтот е responsive и работи на мобилни уреди преку browser.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <MessageSquare size={28} strokeWidth={1.5} className={styles.heroIcon} />
        <h1 className={styles.heroTitle}>Најчесто поставувани прашања</h1>
        <p className={styles.heroSub}>Не го најде одговорот? <Link href="/contact" className={styles.heroLink}>Контактирај не</Link>.</p>
      </div>

      <div className={styles.list}>
        {FAQS.map(({ q, a }, i) => (
          <div key={i} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
            <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
              <span>{q}</span>
              <ChevronDown size={17} strokeWidth={2} className={`${styles.chevron} ${open === i ? styles.chevronOpen : ""}`} />
            </button>
            {open === i && <p className={styles.answer}>{a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
