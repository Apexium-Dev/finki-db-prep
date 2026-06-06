"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Database, Table2, Zap, GitBranch,
  Settings, LogOut, Diamond, Play, BookOpen,
} from "lucide-react";
import { getLevel } from "@/lib/levels";
import { useLanguage } from "./LanguageProvider";
import FeedbackButton from "./FeedbackButton";
import styles from "./Sidebar.module.css";

export default function Sidebar({ totalScore }: { email: string; totalScore: number }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const lvl = getLevel(totalScore);

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.dashboard,   Icon: LayoutDashboard, key: "Dashboard"   },
    { href: "/ddl",       label: t.nav.ddl,          Icon: Database,        key: "DDL"         },
    { href: "/dml",       label: t.nav.dml,          Icon: Table2,          key: "DML"         },
    { href: "/trigger",   label: t.nav.triggers,     Icon: Zap,             key: "Triggers"    },
    { href: "/er",        label: t.nav.erDiagrams,   Icon: GitBranch,       key: "ER Diagrams" },
    { href: "/exam",      label: "Стари Испити",     Icon: BookOpen,        key: "Exam"        },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Diamond size={17} strokeWidth={2.5} className={styles.logoIcon} />
        <div>
          <p className={styles.logoName}>SQLab FINKI</p>
          <p className={styles.logoSub}>{t.nav.sqlPractice}</p>
        </div>
      </div>

      <div className={styles.levelWidget}>
        <div className={styles.levelRow}>
          <div className={styles.levelBadge}>
            <span className={styles.levelNum}>{lvl.level}</span>
          </div>
          <div className={styles.levelInfo}>
            <span className={styles.levelTitle}>{t.levels[lvl.level] ?? lvl.title}</span>
            <span className={styles.levelPts}>
              {lvl.isMax
                ? t.maxLevel
                : t.ptsToNext.replace("{pts}", String(lvl.ptsToNext))}
            </span>
          </div>
        </div>
        <div className={styles.levelBar}>
          <div className={styles.levelFill} style={{ width: `${lvl.progress}%` }} />
        </div>
      </div>

      <Link href="/dashboard" className={styles.startBtn}>
        <Play size={13} strokeWidth={2.5} />
        {t.nav.startPractice}
      </Link>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, Icon, key }) => {
          const isActive = key === "Dashboard"
            ? pathname === "/dashboard"
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={key} href={href} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
              <Icon size={17} strokeWidth={1.8} className={styles.navIcon} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.divider} />
        <Link href="/settings" className={styles.bottomItem}>
          <Settings size={16} strokeWidth={1.8} />
          {t.nav.settings}
        </Link>
        <FeedbackButton triggerClassName={styles.bottomItem} />
        <form action="/auth/signout" method="POST">
          <button type="submit" className={styles.bottomItem}>
            <LogOut size={16} strokeWidth={1.8} />
            {t.nav.logout}
          </button>
        </form>
      </div>
    </aside>
  );
}
