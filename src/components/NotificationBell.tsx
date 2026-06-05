"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Clock, CheckCheck, ListTodo, Trophy } from "lucide-react";
import type { Notification } from "@/app/api/notifications/route";
import { useLanguage } from "./LanguageProvider";
import styles from "./NotificationBell.module.css";

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 1)   return "сега";
  if (mins < 60)  return `пред ${mins} мин`;
  if (hours < 24) return `пред ${hours} час${hours === 1 ? "" : "а"}`;
  if (days === 1) return "Вчера";
  return new Date(dateStr).toLocaleDateString("mk-MK", { day: "2-digit", month: "2-digit" });
}

export default function NotificationBell() {
  const { t } = useLanguage();
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread]               = useState(0);
  const [loaded, setLoaded]               = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load unread count on mount
  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => { setUnread(d.unread ?? 0); setNotifications(d.notifications ?? []); setLoaded(true); });
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleOpen() {
    if (!loaded) {
      const d = await fetch("/api/notifications").then((r) => r.json());
      setNotifications(d.notifications ?? []);
      setUnread(d.unread ?? 0);
      setLoaded(true);
    }
    setOpen((v) => !v);
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "POST" });
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={styles.iconBtn} onClick={handleOpen} aria-label="Известувања">
        <Bell size={17} strokeWidth={1.8} />
        {unread > 0 && <span className={styles.badge}>{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.headerTitle}>{t.notifications.title}</span>
            {unread > 0 && (
              <button className={styles.markRead} onClick={markAllRead}>
                <CheckCheck size={13} strokeWidth={2} />
                {t.notifications.markAll}
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <Bell size={28} strokeWidth={1.4} className={styles.emptyIcon} />
              <p>{t.notifications.empty}</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n.id} className={`${styles.item} ${!n.read ? styles.itemUnread : ""}`}>
                  <div className={`${styles.iconWrap} ${styles[`icon_${n.type}`]}`}>
                    {n.type === "new_tasks"   && <ListTodo size={15} strokeWidth={2} />}
                    {n.type === "leaderboard" && <Trophy   size={15} strokeWidth={2} />}
                  </div>
                  <div className={styles.body}>
                    <p className={styles.itemTitle}>{n.title}</p>
                    <p className={styles.itemBody}>{n.body}</p>
                    <p className={styles.itemTime}>
                      <Clock size={10} strokeWidth={1.8} />
                      {formatTime(n.time)}
                    </p>
                  </div>
                  {!n.read && <span className={styles.unreadDot} />}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.footer}>
            <a href="/dashboard" className={styles.footerLink} onClick={() => setOpen(false)}>
              {t.notifications.viewAll}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
