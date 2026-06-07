import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Mail, MailOpen } from "lucide-react";
import styles from "./page.module.css";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const ADMIN_ID = "81a572ca-2617-4f74-be71-96f61476593f";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id !== ADMIN_ID) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Пораки од корисници</h1>
          <p className={styles.sub}>{messages.length} вкупно · {unread} непрочитани</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className={styles.empty}>
          <Mail size={36} strokeWidth={1.2} className={styles.emptyIcon} />
          <p>Нема пораки уште.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.card} ${!m.read ? styles.cardUnread : ""}`}>
              <div className={styles.cardTop}>
                <div className={styles.sender}>
                  {m.read
                    ? <MailOpen size={15} strokeWidth={1.8} className={styles.iconRead} />
                    : <Mail size={15} strokeWidth={2} className={styles.iconUnread} />
                  }
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.email}>{m.email}</span>
                </div>
                <span className={styles.date}>
                  {new Date(m.created_at).toLocaleDateString("mk-MK", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <p className={styles.subject}>{m.subject}</p>
              <p className={styles.message}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
