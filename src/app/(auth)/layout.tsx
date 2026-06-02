import type { ReactNode } from "react";
import Link from "next/link";
import { Diamond } from "lucide-react";
import styles from "./layout.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      {/* Left — branding */}
      <div className={styles.brand}>
        <div className={styles.brandGlow} aria-hidden />
        <div className={styles.brandGrid} aria-hidden />

        <Link href="/" className={styles.brandLogo}>
          <Diamond size={16} strokeWidth={2.5} className={styles.brandLogoAccent} />
          SQLab FINKI
        </Link>

        <div className={styles.brandBody}>
          <h2 className={styles.brandTitle}>
            Practice SQL.<br />
            <span className={styles.brandAccent}>Ace the exam.</span>
          </h2>
          <p className={styles.brandSub}>
            Instant grading in the browser, tiered hints, step-by-step walkthroughs,
            and a leaderboard to track your progress.
          </p>
        </div>

        <p className={styles.brandFooter}>© {new Date().getFullYear()} SQLab FINKI · FINKI Skopje</p>
      </div>

      {/* Right — form */}
      <div className={styles.card}>
        <div className={styles.cardInner}>{children}</div>
      </div>
    </div>
  );
}
