import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Добредојде</h1>
        <form action="/auth/signout" method="POST">
          <button type="submit" className={styles.signout}>
            Одјава
          </button>
        </form>
      </header>

      <p className={styles.email}>{user?.email}</p>
      <p className={styles.placeholder}>
        Задачите ќе се прикажат тука — во изградба.
      </p>
    </main>
  );
}
