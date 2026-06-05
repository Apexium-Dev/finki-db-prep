import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getLevel } from "@/lib/levels";
import type { Task } from "@/types/database";
import {
  Mail, Calendar, Star, CheckCircle2, Flame, Clock,
  Zap, Shield, Target, Trophy, Crown, Database,
  Table2, Timer, Globe, Lock, Pencil,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./page.module.css";

interface SubmissionWithTask {
  id: string;
  task_id: string;
  is_correct: boolean;
  score: number;
  hints_used: number;
  time_taken_seconds: number | null;
  created_at: string;
  tasks: { title: string; category: string } | null;
}

type BadgeColor = "teal" | "yellow" | "purple" | "blue" | "orange" | "gold";

interface BadgeDef {
  id: string;
  label: string;
  sub: string;
  Icon: LucideIcon;
  color: BadgeColor;
  earned: boolean;
}

const COLOR_CLASS: Record<BadgeColor, string> = {
  teal:   styles.colorTeal,
  yellow: styles.colorYellow,
  purple: styles.colorPurple,
  blue:   styles.colorBlue,
  orange: styles.colorOrange,
  gold:   styles.colorGold,
};

function calcStreak(subs: { created_at: string }[]): number {
  if (!subs.length) return 0;
  const days = Array.from(
    new Set(subs.map((s) => new Date(s.created_at).toDateString()))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    if (days[i] === expected.toDateString()) streak++;
    else break;
  }
  return streak;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `пред ${mins} мин.`;
  if (hours < 24) return `пред ${hours} час${hours === 1 ? "" : "а"}`;
  if (days === 1) return "вчера";
  return new Date(dateStr).toLocaleDateString("mk-MK", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function computeBadges(
  subs: SubmissionWithTask[],
  tasks: Task[],
  totalScore: number,
  streak: number,
): BadgeDef[] {
  const correct = subs.filter((s) => s.is_correct);
  const completedIds = new Set(correct.map((s) => s.task_id));

  const firstSubPerTask = new Map<string, SubmissionWithTask>();
  [...subs].reverse().forEach((s) => firstSubPerTask.set(s.task_id, s));
  const hasFirstTry = Array.from(firstSubPerTask.values()).some((s) => s.is_correct);

  const fastCorrect = correct.filter((s) => s.time_taken_seconds !== null && s.time_taken_seconds <= 300);
  const lightningCorrect = correct.filter((s) => s.time_taken_seconds !== null && s.time_taken_seconds <= 90);
  const sprintTasks = new Set(fastCorrect.map((s) => s.task_id));
  const cleanSolves = correct.filter((s) => s.hints_used === 0);

  const ddlTotal = tasks.filter((t) => t.category === "ddl").length;
  const dmlTotal = tasks.filter((t) => t.category === "dml").length;
  const trigTotal = tasks.filter((t) => t.category === "trigger").length;
  const ddlDone  = tasks.filter((t) => t.category === "ddl"     && completedIds.has(t.id)).length;
  const dmlDone  = tasks.filter((t) => t.category === "dml"     && completedIds.has(t.id)).length;
  const trigDone = tasks.filter((t) => t.category === "trigger" && completedIds.has(t.id)).length;
  const categories = new Set(correct.map((s) => s.tasks?.category ?? "").filter(Boolean));

  return [
    { id: "first_blood", label: "Прва Крв",      sub: "Прво точно решение",       Icon: Trophy,      color: "teal",   earned: correct.length >= 1 },
    { id: "solver",      label: "Решавач",        sub: "5 задачи решени",          Icon: CheckCircle2, color: "teal",  earned: completedIds.size >= 5 },
    { id: "veteran",     label: "Ветеран",        sub: "Сите задачи решени",       Icon: Crown,       color: "gold",   earned: tasks.length > 0 && completedIds.size >= tasks.length },
    { id: "fast",        label: "Брз Решавач",    sub: "Точно под 5 мин.",         Icon: Zap,         color: "yellow", earned: fastCorrect.length >= 1 },
    { id: "lightning",   label: "Молња",          sub: "Точно под 90 сек.",        Icon: Timer,       color: "yellow", earned: lightningCorrect.length >= 1 },
    { id: "sprinter",    label: "Спринтер",       sub: "3 задачи под 5 мин.",      Icon: Zap,         color: "yellow", earned: sprintTasks.size >= 3 },
    { id: "first_try",   label: "Прва Обида",     sub: "Точно на прв обид",        Icon: Target,      color: "purple", earned: hasFirstTry },
    { id: "no_hints",    label: "Без Совети",     sub: "Точно без совети",         Icon: Shield,      color: "purple", earned: cleanSolves.length >= 1 },
    { id: "clean_sheet", label: "Чист Лист",      sub: "5 задачи без совети",      Icon: Shield,      color: "purple", earned: cleanSolves.length >= 5 },
    { id: "ddl_pro",     label: "DDL Про",        sub: `${ddlDone}/${ddlTotal} DDL задачи`,    Icon: Database,    color: "blue",   earned: ddlTotal > 0 && ddlDone >= ddlTotal },
    { id: "dml_pro",     label: "DML Про",        sub: `${dmlDone}/${dmlTotal} DML задачи`,    Icon: Table2,      color: "blue",   earned: dmlTotal > 0 && dmlDone >= dmlTotal },
    { id: "trigger_guru",label: "Trigger Гуру",   sub: `${trigDone}/${trigTotal} Trigger задачи`, Icon: Zap,     color: "blue",   earned: trigTotal > 0 && trigDone >= trigTotal },
    { id: "explorer",    label: "Истражувач",     sub: "3+ категории решени",      Icon: Globe,       color: "blue",   earned: categories.size >= 3 },
    { id: "streak3",     label: "Редовен",        sub: "3 дена по ред",            Icon: Flame,       color: "orange", earned: streak >= 3 },
    { id: "streak7",     label: "Постојан",       sub: "7 дена по ред",            Icon: Flame,       color: "orange", earned: streak >= 7 },
    { id: "collector",   label: "Колекционер",    sub: "500+ поени",               Icon: Star,        color: "gold",   earned: totalScore >= 500 },
    { id: "expert",      label: "Стручњак",       sub: "1 000+ поени",             Icon: Star,        color: "gold",   earned: totalScore >= 1000 },
    { id: "champion",    label: "Шампион",        sub: "2 000+ поени",             Icon: Crown,       color: "gold",   earned: totalScore >= 2000 },
  ];
}

const BADGE_GROUPS = [
  { key: "progress",  label: "Прогрес",    ids: ["first_blood", "solver", "veteran"] },
  { key: "speed",     label: "Брзина",     ids: ["fast", "lightning", "sprinter"] },
  { key: "accuracy",  label: "Прецизност", ids: ["first_try", "no_hints", "clean_sheet"] },
  { key: "category",  label: "Категории",  ids: ["ddl_pro", "dml_pro", "trigger_guru", "explorer"] },
  { key: "streak",    label: "Низа",       ids: ["streak3", "streak7"] },
  { key: "points",    label: "Поени",      ids: ["collector", "expert", "champion"] },
];

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileRaw } = await (supabase as any)
    .from("profiles")
    .select("display_name, username, avatar_url, created_at")
    .eq("id", user!.id)
    .single();
  const profile = profileRaw as {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;

  const displayName  = profile?.display_name ?? user?.email?.split("@")[0] ?? "Student";
  const username     = profile?.username ?? null;
  const avatarUrl    = profile?.avatar_url ?? null;
  const enrolledYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : new Date().getFullYear();

  const { data: taskData } = await supabase.from("tasks").select("*").eq("verified", true);
  const tasks = (taskData ?? []) as Task[];

  const { data: subData } = await supabase
    .from("submissions")
    .select("id, task_id, is_correct, score, hints_used, time_taken_seconds, created_at, tasks(title, category)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(100);
  const subs = (subData ?? []) as SubmissionWithTask[];

  const bestPerTask = new Map<string, number>();
  subs.forEach((s) => {
    if (!bestPerTask.has(s.task_id) || bestPerTask.get(s.task_id)! < s.score)
      bestPerTask.set(s.task_id, s.score);
  });
  const totalScore    = Math.round(Array.from(bestPerTask.values()).reduce((a, b) => a + b, 0));
  const completedCount = new Set(subs.filter((s) => s.is_correct).map((s) => s.task_id)).size;
  const streak        = calcStreak(subs);
  const lvl           = getLevel(totalScore);

  const badges     = computeBadges(subs, tasks, totalScore, streak);
  const earnedCount = badges.filter((b) => b.earned).length;
  const badgeMap   = new Map(badges.map((b) => [b.id, b]));

  const recentActivity = subs.slice(0, 5);

  return (
    <div className={styles.page}>

      {/* ── Profile ── */}
      <div className={styles.profileRow}>

        {/* User card */}
        <div className={styles.userCard}>
          <div className={styles.avatarWrap}>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={72}
                height={72}
                className={styles.avatarImg}
                unoptimized
              />
            ) : (
              <div className={styles.avatarLarge}>{displayName[0].toUpperCase()}</div>
            )}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userNameRow}>
              <h1 className={styles.userName}>{displayName}</h1>
              <Link href="/profile/edit" className={styles.editBtn}>
                <Pencil size={13} strokeWidth={2} />
                Уреди
              </Link>
            </div>
            {username && <p className={styles.usernameTag}>@{username}</p>}
            <div className={styles.userMeta}>
              <span className={styles.metaItem}><Mail size={13} strokeWidth={1.8} />{user?.email}</span>
              <span className={styles.metaItem}><Calendar size={13} strokeWidth={1.8} />Запишан {enrolledYear}</span>
            </div>
            <div className={styles.levelChip}>
              <span className={styles.levelNum}>{lvl.level}</span>
              <span className={styles.levelTitle}>{lvl.title}</span>
              {!lvl.isMax && <span className={styles.levelPts}>{lvl.ptsToNext} pts до следно</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsCol}>
          <div className={styles.statCard}>
            <div className={styles.statBody}>
              <p className={styles.statLabel}>ВКУПНО ПОЕНИ</p>
              <p className={styles.statValue}>{totalScore.toLocaleString()}</p>
            </div>
            <div className={`${styles.statIcon} ${styles.iconPurple}`}><Star size={17} strokeWidth={2} /></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statBody}>
              <p className={styles.statLabel}>ЗАВРШЕНИ ЗАДАЧИ</p>
              <p className={styles.statValue}>{completedCount}</p>
            </div>
            <div className={`${styles.statIcon} ${styles.iconGray}`}><CheckCircle2 size={17} strokeWidth={2} /></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statBody}>
              <p className={styles.statLabel}>МОМЕНТАЛНА НИЗА</p>
              <p className={styles.statValue}>{streak}<span className={styles.statUnit}> ден{streak === 1 ? "" : "а"}</span></p>
            </div>
            <div className={`${styles.statIcon} ${styles.iconOrange}`}><Flame size={17} strokeWidth={2} /></div>
          </div>
        </div>

        {/* Activity */}
        <div className={styles.activityCard}>
          <h3 className={styles.cardTitle}>Неодамнешна активност</h3>
          {recentActivity.length === 0 ? (
            <p className={styles.emptyActivity}>Нема активност уште. Започни со вежбање!</p>
          ) : (
            <ul className={styles.activityList}>
              {recentActivity.map((s) => (
                <li key={s.id} className={styles.activityItem}>
                  <span className={`${styles.dot} ${s.is_correct ? styles.dotGreen : styles.dotGray}`} />
                  <div className={styles.activityBody}>
                    <p className={styles.activityText}>
                      {s.is_correct ? "Точно: " : "Обид: "}
                      <span className={styles.taskName}>{s.tasks?.title ?? "—"}</span>
                    </p>
                    <p className={styles.activityMeta}>
                      <Clock size={10} strokeWidth={1.8} />
                      {formatRelativeTime(s.created_at)}
                      {s.score > 0 && <span className={styles.scoreChip}>+{Math.round(s.score)} pts</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div className={styles.achievementsSection}>
        <div className={styles.achievementsHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Достигнувања</h2>
            <p className={styles.sectionSub}>Собери ги сите беџови и покажи кој е најдобар.</p>
          </div>
          <div className={styles.earnedPill}>
            <Trophy size={13} strokeWidth={2} />
            {earnedCount} / {badges.length} освоени
          </div>
        </div>

        <div className={styles.badgeGroups}>
          {BADGE_GROUPS.map((group) => (
            <div key={group.key} className={styles.badgeGroup}>
              <p className={styles.groupLabel}>{group.label}</p>
              <div className={styles.badgeRow}>
                {group.ids.map((id) => {
                  const b = badgeMap.get(id);
                  if (!b) return null;
                  return (
                    <div
                      key={b.id}
                      className={`${styles.badge} ${b.earned ? COLOR_CLASS[b.color] : styles.badgeLocked}`}
                      title={b.sub}
                    >
                      <div className={styles.badgeIconWrap}>
                        {b.earned
                          ? <b.Icon size={22} strokeWidth={1.8} />
                          : <Lock size={16} strokeWidth={2} />
                        }
                      </div>
                      <p className={styles.badgeLabel}>{b.label}</p>
                      <p className={styles.badgeSub}>{b.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
