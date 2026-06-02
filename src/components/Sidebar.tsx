"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Table2,
  Zap,
  GitBranch,
  Settings,
  LogOut,
  Diamond,
  Play,
} from "lucide-react";
import { getLevel } from "@/lib/levels";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { href: "/dashboard",                    label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/dashboard?category=ddl",       label: "DDL",         Icon: Database        },
  { href: "/dashboard?category=dml",       label: "DML",         Icon: Table2          },
  { href: "/dashboard?category=trigger",   label: "Triggers",    Icon: Zap             },
  { href: "/dashboard?category=er",        label: "ER Diagrams", Icon: GitBranch       },
];

export default function Sidebar({ totalScore }: { email: string; totalScore: number }) {
  const pathname = usePathname();
  const lvl = getLevel(totalScore);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Diamond size={17} strokeWidth={2.5} className={styles.logoIcon} />
        <div>
          <p className={styles.logoName}>SQLab FINKI</p>
          <p className={styles.logoSub}>SQL Practice</p>
        </div>
      </div>

      {/* Level widget */}
      <div className={styles.levelWidget}>
        <div className={styles.levelRow}>
          <div className={styles.levelBadge}>
            <span className={styles.levelNum}>{lvl.level}</span>
          </div>
          <div className={styles.levelInfo}>
            <span className={styles.levelTitle}>{lvl.title}</span>
            <span className={styles.levelPts}>
              {lvl.isMax ? "Max level" : `${lvl.ptsToNext} pts to next`}
            </span>
          </div>
        </div>
        <div className={styles.levelBar}>
          <div
            className={styles.levelFill}
            style={{ width: `${lvl.progress}%` }}
          />
        </div>
      </div>

      {/* Start practice CTA */}
      <Link href="/dashboard" className={styles.startBtn}>
        <Play size={13} strokeWidth={2.5} />
        Start Practice
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            label === "Dashboard"
              ? pathname === "/dashboard" && !pathname.includes("category")
              : false;
          return (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon size={17} strokeWidth={1.8} className={styles.navIcon} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.divider} />
        <Link href="/settings" className={styles.bottomItem}>
          <Settings size={16} strokeWidth={1.8} />
          Settings
        </Link>
        <form action="/auth/signout" method="POST">
          <button type="submit" className={styles.bottomItem}>
            <LogOut size={16} strokeWidth={1.8} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
