export interface Level {
  level: number;
  title: string;
  minPts: number;
  maxPts: number; // exclusive, Infinity for last
}

export const LEVELS: Level[] = [
  { level: 1, title: "Newcomer",    minPts: 0,    maxPts: 200   },
  { level: 2, title: "Apprentice",  minPts: 200,  maxPts: 500   },
  { level: 3, title: "Practitioner",minPts: 500,  maxPts: 1000  },
  { level: 4, title: "Developer",   minPts: 1000, maxPts: 2000  },
  { level: 5, title: "Expert",      minPts: 2000, maxPts: 4000  },
  { level: 6, title: "Master",      minPts: 4000, maxPts: Infinity },
];

export function getLevel(pts: number) {
  const current = [...LEVELS].reverse().find((l) => pts >= l.minPts) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;

  const ptsInLevel = pts - current.minPts;
  const levelRange = next ? next.minPts - current.minPts : 1;
  const progress = Math.min(100, Math.round((ptsInLevel / levelRange) * 100));

  return {
    level: current.level,
    title: current.title,
    ptsToNext: next ? next.minPts - pts : 0,
    isMax: !next,
    progress,
  };
}
