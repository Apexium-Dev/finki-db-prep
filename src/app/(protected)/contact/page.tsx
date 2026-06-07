import { createClient } from "@/lib/supabase/server";
import { Mail } from "lucide-react";
import ContactForm from "./ContactForm";
import styles from "./page.module.css";

export default async function ContactPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.email?.split("@")[0] ?? "";
  const email = user?.email ?? "";

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.iconWrap}>
            <Mail size={22} strokeWidth={1.6} className={styles.icon} />
          </div>
          <div>
            <h1 className={styles.title}>Контакт со администратор</h1>
            <p className={styles.sub}>Имаш прашање или забележа грешка? Пишете ни.</p>
          </div>
        </div>
        <ContactForm name={name} email={email} />
      </div>
    </div>
  );
}
