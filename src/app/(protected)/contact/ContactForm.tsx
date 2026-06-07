"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

export default function ContactForm({ name, email }: { name: string; email: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any).from("contact_messages").insert({
      user_id: user?.id ?? null,
      name,
      email,
      subject: subject.trim() || "Без тема",
      message: message.trim(),
    });

    if (err) {
      setError("Се случи грешка. Обиди се повторно.");
    } else {
      setSent(true);
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className={styles.success}>
        <CheckCircle size={40} strokeWidth={1.4} className={styles.successIcon} />
        <h2 className={styles.successTitle}>Пораката е испратена!</h2>
        <p className={styles.successSub}>Ќе ти одговориме наскоро.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Ime</label>
          <input className={styles.input} value={name} disabled />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={email} disabled />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Тема (опционално)</label>
        <input
          className={styles.input}
          placeholder="На пример: Грешка во задача, Прашање за платформата..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={120}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Порака <span className={styles.required}>*</span></label>
        <textarea
          className={styles.textarea}
          placeholder="Напиши ја твојата порака тука..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={!message.trim() || sending}>
        <Send size={15} strokeWidth={2} />
        {sending ? "Се испраќа..." : "Испрати порака"}
      </button>
    </form>
  );
}
