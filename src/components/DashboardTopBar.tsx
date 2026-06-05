import Link from "next/link";
import { Search } from "lucide-react";
import NotificationBell from "./NotificationBell";
import HelpDropdown from "./HelpDropdown";
import LanguageToggle from "./LanguageToggle";
import FeedbackButton from "./FeedbackButton";
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
        <LanguageToggle />
        <FeedbackButton />
        <NotificationBell />
        <HelpDropdown />
        <Link href="/profile" className={styles.avatar} aria-label="Profile">
          {userInitial.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
