import Link from "next/link";
import { Search, Bell, HelpCircle } from "lucide-react";
import styles from "./DashboardTopBar.module.css";

export default function DashboardTopBar({ userInitial }: { userInitial: string }) {
  return (
    <div className={styles.bar}>
      <span className={styles.brand}>SQL Lab</span>

      <div className={styles.search}>
        <Search size={15} strokeWidth={1.8} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Пребарај задачи..."
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} />
        </button>
        <button className={styles.iconBtn} aria-label="Help">
          <HelpCircle size={17} strokeWidth={1.8} />
        </button>
        <Link href="/profile" className={styles.avatar} aria-label="Profile">
          {userInitial.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
