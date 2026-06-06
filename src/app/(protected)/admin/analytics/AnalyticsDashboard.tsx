"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";
import styles from "./page.module.css";

type Range = "day" | "week" | "month";

interface Props {
  summary: { totalStudents: number; totalSubmissions: number; correctRate: number; taskCount: number };
  rawTimestamps: { date: string; hour: string; is_correct: boolean }[];
  pieData: { name: string; value: number }[];
  hardest: { title: string; rate: number; total: number }[];
  mostAttempted: { title: string; total: number; correct: number }[];
  byCategory: { cat: string; total: number; correct: number }[];
}

const TEAL = "#14b8a6";
const BLUE = "#3b82f6";
const RED  = "#f87171";
const PIE_COLORS = [TEAL, RED];

const SHORT_LABEL: Record<string, string> = {
  ddl: "DDL", dml: "DML", trigger: "Trigger", er: "ER", unknown: "?",
};

function shortTitle(title: string, max = 22) {
  return title.length > max ? title.slice(0, max) + "…" : title;
}

// Ден — денес по час (00–23)
function buildTodayData(raw: { date: string; hour: string; is_correct: boolean }[]) {
  const today = new Date().toISOString().slice(0, 10);
  const map: Record<string, { total: number; correct: number }> = {};
  for (let h = 0; h < 24; h++) {
    map[String(h).padStart(2, "0")] = { total: 0, correct: 0 };
  }
  for (const s of raw) {
    if (s.date === today && map[s.hour]) {
      map[s.hour].total++;
      if (s.is_correct) map[s.hour].correct++;
    }
  }
  return Object.entries(map).map(([h, v]) => ({ label: `${h}:00`, ...v }));
}

// Недела — последните 7 дена
function buildWeekData(raw: { date: string; is_correct: boolean }[]) {
  const now = new Date();
  const map: Record<string, { total: number; correct: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map[d.toISOString().slice(0, 10)] = { total: 0, correct: 0 };
  }
  for (const s of raw) {
    if (map[s.date]) {
      map[s.date].total++;
      if (s.is_correct) map[s.date].correct++;
    }
  }
  return Object.entries(map).map(([date, v]) => ({ label: date.slice(5), ...v }));
}

// Месец — последните 30 дена
function buildMonthData(raw: { date: string; is_correct: boolean }[]) {
  const now = new Date();
  const map: Record<string, { total: number; correct: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map[d.toISOString().slice(0, 10)] = { total: 0, correct: 0 };
  }
  for (const s of raw) {
    if (map[s.date]) {
      map[s.date].total++;
      if (s.is_correct) map[s.date].correct++;
    }
  }
  return Object.entries(map).map(([date, v]) => ({ label: date.slice(5), ...v }));
}

export default function AnalyticsDashboard({ summary, rawTimestamps, pieData, hardest, mostAttempted, byCategory }: Props) {
  const [range, setRange] = useState<Range>("day");

  const chartData = useMemo(() => {
    if (range === "day") return buildTodayData(rawTimestamps);
    if (range === "week") return buildWeekData(rawTimestamps);
    return buildMonthData(rawTimestamps);
  }, [range, rawTimestamps]);

  const rangeLabel = range === "day" ? "денес" : range === "week" ? "последни 7 дена" : "последни 30 дена";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
        <a href="/admin" className={styles.backLink}>← Повратна информација</a>
      </div>

      {/* Summary cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardVal}>{summary.totalStudents}</p>
          <p className={styles.cardLabel}>Студенти</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardVal}>{summary.totalSubmissions.toLocaleString()}</p>
          <p className={styles.cardLabel}>Поднесувања</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardVal}>{summary.correctRate}%</p>
          <p className={styles.cardLabel}>Точност</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardVal}>{summary.taskCount}</p>
          <p className={styles.cardLabel}>Задачи</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className={styles.grid}>

        {/* Submissions over time */}
        <div className={`${styles.chart} ${styles.chartWide}`}>
          <div className={styles.chartHeader}>
            <p className={styles.chartTitle}>Поднесувања — {rangeLabel}</p>
            <div className={styles.rangeToggle}>
              {(["day", "week", "month"] as Range[]).map((r) => (
                <button
                  key={r}
                  className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ""}`}
                  onClick={() => setRange(r)}
                >
                  {r === "day" ? "Ден" : r === "week" ? "Недела" : "Месец"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: "#4a5568", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#4a5568", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0d1f2d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }} itemStyle={{ color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="total" stroke={BLUE} strokeWidth={2} dot={false} name="Вкупно" />
              <Line type="monotone" dataKey="correct" stroke={TEAL} strokeWidth={2} dot={false} name="Точни" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className={styles.chart}>
          <p className={styles.chartTitle}>Точни vs Неточни</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" paddingAngle={3} labelLine={false}
              >
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
              <Tooltip contentStyle={{ background: "#0d1f2d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* By category */}
        <div className={styles.chart}>
          <p className={styles.chartTitle}>Поднесувања по категорија</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byCategory} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="cat" tickFormatter={(v) => SHORT_LABEL[v] ?? v} tick={{ fill: "#4a5568", fontSize: 11 }} />
              <YAxis tick={{ fill: "#4a5568", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0d1f2d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v) => SHORT_LABEL[v as string] ?? v} itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="total" fill={BLUE} name="Вкупно" radius={[4, 4, 0, 0]} />
              <Bar dataKey="correct" fill={TEAL} name="Точни" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 hardest */}
        <div className={`${styles.chart} ${styles.chartWide}`}>
          <p className={styles.chartTitle}>Топ 10 најтешки задачи (мин. 5 обиди)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hardest} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#4a5568", fontSize: 10 }} />
              <YAxis type="category" dataKey="title" width={160} tickFormatter={(v) => shortTitle(v)} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0d1f2d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v}%`, "Точност"]} itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="rate" fill={RED} name="Точност %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 most attempted */}
        <div className={`${styles.chart} ${styles.chartWide}`}>
          <p className={styles.chartTitle}>Топ 10 најпробувани задачи</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mostAttempted} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#4a5568", fontSize: 10 }} />
              <YAxis type="category" dataKey="title" width={160} tickFormatter={(v) => shortTitle(v)} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0d1f2d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="total" fill={BLUE} name="Вкупно" radius={[0, 4, 4, 0]} />
              <Bar dataKey="correct" fill={TEAL} name="Точни" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
