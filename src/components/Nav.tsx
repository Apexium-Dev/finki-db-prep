import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          FINKI DB Prep
        </Link>
        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>
            Најава
          </Link>
          <Link href="/signup" className={styles.signup}>
            Регистрирај се
          </Link>
        </div>
      </div>
    </nav>
  );
}
