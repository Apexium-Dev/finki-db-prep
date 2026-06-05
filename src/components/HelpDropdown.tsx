"use client";

import { useState, useEffect, useRef } from "react";
import { HelpCircle, GraduationCap, BookOpen, MessageSquare, Headphones } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import styles from "./HelpDropdown.module.css";

export default function HelpDropdown() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const ITEMS = [
    { Icon: GraduationCap, label: t.help.beginnerGuide, href: "#" },
    { Icon: BookOpen,      label: t.help.sqlReference,  href: "#" },
    { Icon: MessageSquare, label: t.help.faq,           href: "#" },
    { Icon: Headphones,    label: t.help.contact,       href: "mailto:admin@finki.ukim.mk" },
  ];

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={`${styles.iconBtn} ${open ? styles.iconBtnActive : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t.topbar.help}
      >
        <HelpCircle size={17} strokeWidth={1.8} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <p className={styles.header}>{t.help.title}</p>
          <ul className={styles.list}>
            {ITEMS.map(({ Icon, label, href }) => (
              <li key={label}>
                <a href={href} className={styles.item} onClick={() => setOpen(false)}>
                  <div className={styles.iconWrap}><Icon size={17} strokeWidth={1.6} /></div>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
