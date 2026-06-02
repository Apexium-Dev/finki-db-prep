import { Search } from "lucide-react";
import styles from "./DashboardTopBar.module.css";

export default function DashboardTopBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.breadcrumb}>SQL Lab</span>

      <div className={styles.search}>
        <Search size={15} strokeWidth={1.8} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search tasks..."
        />
      </div>
    </div>
  );
}
