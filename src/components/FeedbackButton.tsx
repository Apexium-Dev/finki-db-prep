"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./FeedbackButton.module.css";

export default function FeedbackButton({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "suggestion">("bug");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function submit() {
    if (!message.trim()) return;
    setStatus("loading");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("feedback").insert({
      user_id: user!.id,
      type,
      message: message.trim(),
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setTimeout(() => {
      setOpen(false);
      setMessage("");
      setType("bug");
      setStatus("idle");
    }, 1800);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={triggerClassName ?? styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-label="Пријави проблем или сугестија"
      >
        <Flag size={16} strokeWidth={1.8} />
        Пријави проблем
      </button>

      {open && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <span className={styles.modalTitle}>Повратна информација</span>
            <button className={styles.close} onClick={() => setOpen(false)}>
              <X size={15} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${type === "bug" ? styles.tabActive : ""}`}
              onClick={() => setType("bug")}
            >
              Проблем
            </button>
            <button
              className={`${styles.tab} ${type === "suggestion" ? styles.tabActive : ""}`}
              onClick={() => setType("suggestion")}
            >
              Сугестија
            </button>
          </div>

          <textarea
            className={styles.textarea}
            placeholder={
              type === "bug"
                ? "Опиши го проблемот — каде се случи, што очекуваше..."
                : "Каква промена би ја видел на платформата?"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            disabled={status === "loading" || status === "success"}
          />

          {status === "error" && (
            <p className={styles.errorMsg}>Нешто тргна наопаку. Обиди се повторно.</p>
          )}

          {status === "success" ? (
            <p className={styles.successMsg}>✓ Пратено. Благодарам!</p>
          ) : (
            <button
              className={styles.submit}
              onClick={submit}
              disabled={!message.trim() || status === "loading"}
            >
              <Send size={14} strokeWidth={2} />
              {status === "loading" ? "Се праќа..." : "Прати"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
