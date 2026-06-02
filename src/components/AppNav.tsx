import Link from "next/link";
import styles from "./AppNav.module.css";

export default function AppNav({ email }: { email: string }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.logo}>
          SQLab FINKI
        </Link>
        <div className={styles.right}>
          <span className={styles.email}>{email}</span>
          <form action="/auth/signout" method="POST">
            <button type="submit" className={styles.signout}>
              Одјава
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
