"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();

  function toggle(l: "mk" | "en") {
    setLocale(l);
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${locale === "mk" ? styles.active : ""}`}
        onClick={() => toggle("mk")}
      >
        MK
      </button>
      <button
        className={`${styles.btn} ${locale === "en" ? styles.active : ""}`}
        onClick={() => toggle("en")}
      >
        EN
      </button>
    </div>
  );
}
