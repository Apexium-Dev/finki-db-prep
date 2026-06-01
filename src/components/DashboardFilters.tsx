"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import styles from "./DashboardFilters.module.css";

const CATEGORIES = [
  { value: "", label: "Сите" },
  { value: "dml", label: "DML" },
  { value: "ddl", label: "DDL" },
  { value: "trigger", label: "Тригери" },
  { value: "er", label: "ER дијаграм" },
  { value: "relations", label: "Релации" },
];

const DIFFICULTIES = [
  { value: "", label: "Сите" },
  { value: "1", label: "★" },
  { value: "2", label: "★★" },
  { value: "3", label: "★★★" },
  { value: "4", label: "★★★★" },
  { value: "5", label: "★★★★★" },
];

export default function DashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeDifficulty = searchParams.get("difficulty") ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <span className={styles.groupLabel}>Категорија</span>
        <div className={styles.chips}>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`${styles.chip} ${activeCategory === c.value ? styles.active : ""}`}
              onClick={() => setParam("category", c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Тежина</span>
        <div className={styles.chips}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              className={`${styles.chip} ${activeDifficulty === d.value ? styles.active : ""}`}
              onClick={() => setParam("difficulty", d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
