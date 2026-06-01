"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <>
        <h1 className={styles.title}>Провери ја е-поштата</h1>
        <p className={styles.subtitle}>
          Испративме линк за потврда на <strong>{email}</strong>. Кликни на линкот за да го активираш профилот.
        </p>
        <Link href="/login" className={styles.backLink}>
          ← Назад кон најава
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Регистрација</h1>
      <p className={styles.subtitle}>FINKI DB Prep</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Е-пошта
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className={styles.label}>
          Лозинка
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <span className={styles.hint}>Минимум 6 карактери</span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Се регистрирам..." : "Регистрирај се"}
        </button>
      </form>

      <p className={styles.footer}>
        Веќе имаш профил?{" "}
        <Link href="/login" className={styles.link}>
          Најава
        </Link>
      </p>
    </>
  );
}
