export type Locale = "mk" | "en";

export interface Translations {
  locale: Locale;

  // ── Common ──
  save: string;
  cancel: string;
  back: string;
  loading: string;
  pts: string;
  days: string;
  day: string;
  hints: string;
  min: string;

  // ── Levels ──
  levels: Record<number, string>;
  maxLevel: string;
  ptsToNext: string; // use {pts}

  // ── Sidebar ──
  nav: {
    sqlPractice: string;
    startPractice: string;
    dashboard: string;
    ddl: string;
    dml: string;
    triggers: string;
    erDiagrams: string;
    settings: string;
    logout: string;
  };

  // ── Topbar ──
  topbar: {
    searchPlaceholder: string;
    notifications: string;
    help: string;
  };

  // ── Help dropdown ──
  help: {
    title: string;
    beginnerGuide: string;
    sqlReference: string;
    faq: string;
    contact: string;
  };

  // ── Notifications ──
  notifications: {
    title: string;
    markAll: string;
    empty: string;
    viewAll: string;
    newTasks: (count: number, label: string) => string;
    newTasksBody: (count: number) => string;
    leaderboard: string;
    leaderboardBody: (medal: string) => string;
  };

  // ── Dashboard ──
  dashboard: {
    welcomeTitle: (name: string) => string;
    welcomeSub: string;
    totalPoints: string;
    activeStreak: string;
    completedTasks: string;
    keepItUp: string;
    startToday: string;
    leaderboard: string;
    top5: string;
    fullList: string;
    categories: {
      ddl: { label: string; desc: string };
      dml: { label: string; desc: string };
      trigger: { label: string; desc: string };
      er: { label: string; desc: string };
    };
  };

  // ── Category pages ──
  category: {
    activeTasks: string;
    completed: string;
    currentDifficulty: string;
    availableTasks: string;
    all: string;
    hard: string;
    searchPlaceholder: string;
    startLink: string;
    viewSolution: string;
    completedBadge: string;
    noResults: string;
    difficulty: Record<number, string>;
    // Page-specific
    ddl: { title: string; subtitle: string };
    dml: { title: string; subtitle: string };
    trigger: { title: string; subtitle: string };
    er: { title: string; subtitle: string };
  };

  // ── Task Solver ──
  task: {
    dashboardLink: string;
    categoryLabels: Record<string, string>;
    checkCode: string;
    taskSection: string;
    schemaSection: string;
    hintsSection: string;
    hint: (n: number) => string;
    editorLabel: string;
    formatBtn: string;
    clearBtn: string;
    resultsTab: string;
    logTab: string;
    noResults: string;
    noResultsSub: string;
    logNoData: string;
    points: string;
  };

  // ── Profile ──
  profile: {
    title: string;
    subtitle: string;
    achievementsTitle: string;
    achievementsSub: string;
    earnedOf: (earned: number, total: number) => string;
    totalPoints: string;
    completedTasks: string;
    currentStreak: string;
    recentActivity: string;
    noActivity: string;
    correct: string;
    attempt: string;
    enrolled: (year: number) => string;
    editBtn: string;
    badgeGroups: Record<string, string>;
    badges: Record<string, { label: string; sub: string }>;
  };

  // ── Profile edit ──
  profileEdit: {
    title: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    usernameHint: string;
    emailLabel: string;
    emailHint: string;
    avatarHint: string;
    saveBtn: string;
    cancelBtn: string;
    errors: {
      nameRequired: string;
      usernameInvalid: string;
      usernameTaken: string;
      generic: string;
      uploadSize: string;
      uploadType: string;
      uploadFail: string;
    };
  };

  // ── Leaderboard ──
  leaderboard: {
    title: string;
    subtitle: string;
    yourRank: string;
    searchPlaceholder: string;
    users: string;
    colRank: string;
    colUser: string;
    colLevel: string;
    colTasks: string;
    colPoints: string;
    noResults: string;
    youBadge: string;
  };

  // ── Auth ──
  auth: {
    loginTitle: string;
    loginSub: string;
    signupTitle: string;
    signupSub: string;
    emailLabel: string;
    passwordLabel: string;
    loginBtn: string;
    signupBtn: string;
    noAccount: string;
    hasAccount: string;
    signupLink: string;
    loginLink: string;
  };
}

// ─────────────────────────────────────────────────────────
// MACEDONIAN
// ─────────────────────────────────────────────────────────
export const mk: Translations = {
  locale: "mk",
  save: "Зачувај",
  cancel: "Откажи",
  back: "Назад",
  loading: "Се вчитува...",
  pts: "поени",
  days: "дена",
  day: "ден",
  hints: "совети",
  min: "мин",

  levels: { 1: "Почетник", 2: "Приправник", 3: "Практичар", 4: "Развивач", 5: "Експерт", 6: "Мајстор" },
  maxLevel: "Максимално ниво",
  ptsToNext: "{pts} pts до следно",

  nav: {
    sqlPractice: "SQL Вежбање",
    startPractice: "Започни вежбање",
    dashboard: "Dashboard",
    ddl: "DDL",
    dml: "DML",
    triggers: "Тригери",
    erDiagrams: "ER Дијаграми",
    settings: "Поставки",
    logout: "Одјава",
  },

  topbar: {
    searchPlaceholder: "Пребарај задачи...",
    notifications: "Известувања",
    help: "Помош",
  },

  help: {
    title: "ЦЕНТАР ЗА ПОМОШ",
    beginnerGuide: "Водич за почетници",
    sqlReference: "SQL Референца",
    faq: "Најчесто поставувани прашања",
    contact: "Контакт со администратор",
  },

  notifications: {
    title: "Известувања",
    markAll: "Означи ги сите",
    empty: "Нема нови известувања.",
    viewAll: "Види ги сите задачи",
    newTasks: (count, label) => `${count} нов${count === 1 ? "а" : "и"} ${label} задач${count === 1 ? "а" : "и"}`,
    newTasksBody: (count) => `Можеш ли да ги решиш${count === 1 ? "?" : " сите?"}`,
    leaderboard: "Ранг листа",
    leaderboardBody: (medal) => `Моментално си на место ${medal} од топ 10!`,
  },

  dashboard: {
    welcomeTitle: (name) => `Добредојде, ${name}!`,
    welcomeSub: "Твој дневен преглед на SQL вежбање.",
    totalPoints: "Вкупно Поени",
    activeStreak: "Активна Низа",
    completedTasks: "Завршени Задачи",
    keepItUp: "Продолжи!",
    startToday: "Започни денес",
    leaderboard: "Ранг Листа",
    top5: "Топ 5",
    fullList: "Целосна листа",
    categories: {
      ddl: { label: "DDL (Data Definition)", desc: "CREATE TABLE, примарни клучеви, ограничувања" },
      dml: { label: "DML (Data Manipulation)", desc: "SELECT, JOIN, GROUP BY, подупрашувања" },
      trigger: { label: "Тригери", desc: "BEFORE/AFTER, PL/pgSQL, тестирање на состојба" },
      er: { label: "ER Дијаграми", desc: "Ентитети, врски, кардиналност" },
    },
  },

  category: {
    activeTasks: "Активни Задачи",
    completed: "Завршени",
    currentDifficulty: "Тековна тежина",
    availableTasks: "Достапни Задачи",
    all: "Сите",
    hard: "Тешки",
    searchPlaceholder: "Пребарај задачи...",
    startLink: "Започни →",
    viewSolution: "Прегледај решение",
    completedBadge: "Завршено",
    noResults: "Нема задачи кои одговараат на пребарувањето.",
    difficulty: { 1: "Лесна", 2: "Средна", 3: "Тешка", 4: "Напредна", 5: "Експертска" },
    ddl: {
      title: "DDL — Дефиниција на Податоци",
      subtitle: "CREATE TABLE, примарни клучеви, ограничувања и индекси. Практични задачи за дефинирање на структурата на релациони бази.",
    },
    dml: {
      title: "DML — Манипулација со Податоци",
      subtitle: "SELECT, JOIN, GROUP BY, подупрашувања и агрегации. Задачи за пишување SQL прашувања за пребарување и манипулација со податоци.",
    },
    trigger: {
      title: "Тригери",
      subtitle: "BEFORE/AFTER настани, PL/pgSQL и тестирање на состојба. Автоматизирај логика директно во базата на податоци.",
    },
    er: {
      title: "ER Дијаграми",
      subtitle: "Визуелно моделирање на ентитети и нивните врски. Практични задачи за дизајнирање на релациони бази на податоци пред имплементација.",
    },
  },

  task: {
    dashboardLink: "Dashboard",
    categoryLabels: { dml: "DML Task", ddl: "DDL Task", trigger: "Trigger Task", er: "ER Task", relations: "Relations Task" },
    checkCode: "Провери код",
    taskSection: "Задача",
    schemaSection: "ER Дијаграм / Шема",
    hintsSection: "Помош (Hints)",
    hint: (n) => `Совет ${n}`,
    editorLabel: "SQL_EDITOR.SQL",
    formatBtn: "Форматирај",
    clearBtn: "Исчисти",
    resultsTab: "Резултати",
    logTab: "Output лог",
    noResults: "Нема извршени прашања",
    noResultsSub: "Напишете прашалник и притиснете на копчето за да ги видите резултатите тука.",
    logNoData: "-- Нема лог уште",
    points: "поени",
  },

  profile: {
    title: "Студентски Профил",
    subtitle: "Преглед на академски достигнувања и активност.",
    achievementsTitle: "Достигнувања",
    achievementsSub: "Собери ги сите беџови и покажи кој е најдобар.",
    earnedOf: (e, t) => `${e} / ${t} освоени`,
    totalPoints: "ВКУПНО ПОЕНИ",
    completedTasks: "ЗАВРШЕНИ ЗАДАЧИ",
    currentStreak: "МОМЕНТАЛНА НИЗА",
    recentActivity: "Неодамнешна активност",
    noActivity: "Нема активност уште. Започни со вежбање!",
    correct: "Точно: ",
    attempt: "Обид: ",
    enrolled: (y) => `Запишан ${y}`,
    editBtn: "Уреди",
    badgeGroups: { progress: "Прогрес", speed: "Брзина", accuracy: "Прецизност", category: "Категории", streak: "Низа", points: "Поени" },
    badges: {
      first_blood:  { label: "Прва Крв",      sub: "Прво точно решение"       },
      solver:       { label: "Решавач",        sub: "5 задачи решени"          },
      veteran:      { label: "Ветеран",        sub: "Сите задачи решени"       },
      fast:         { label: "Брз Решавач",    sub: "Точно под 5 мин."         },
      lightning:    { label: "Молња",          sub: "Точно под 90 сек."        },
      sprinter:     { label: "Спринтер",       sub: "3 задачи под 5 мин."      },
      first_try:    { label: "Прва Обида",     sub: "Точно на прв обид"        },
      no_hints:     { label: "Без Совети",     sub: "Точно без совети"         },
      clean_sheet:  { label: "Чист Лист",      sub: "5 задачи без совети"      },
      ddl_pro:      { label: "DDL Про",        sub: "Сите DDL задачи"          },
      dml_pro:      { label: "DML Про",        sub: "Сите DML задачи"          },
      trigger_guru: { label: "Trigger Гуру",   sub: "Сите Trigger задачи"      },
      explorer:     { label: "Истражувач",     sub: "3+ категории решени"      },
      streak3:      { label: "Редовен",        sub: "3 дена по ред"            },
      streak7:      { label: "Постојан",       sub: "7 дена по ред"            },
      collector:    { label: "Колекционер",    sub: "500+ поени"               },
      expert:       { label: "Стручњак",       sub: "1 000+ поени"             },
      champion:     { label: "Шампион",        sub: "2 000+ поени"             },
    },
  },

  profileEdit: {
    title: "Уреди профил",
    displayNameLabel: "Прикажано ime",
    displayNamePlaceholder: "Пример: Петар Т.",
    usernameLabel: "Корисничко ime",
    usernamePlaceholder: "petar_t",
    usernameHint: "Мали букви, бројки и _ · 3–30 знаци · опционално",
    emailLabel: "E-пошта",
    emailHint: "E-поштата не може да се промени.",
    avatarHint: "JPG, PNG · макс. 2 MB",
    saveBtn: "Зачувај",
    cancelBtn: "Откажи",
    errors: {
      nameRequired: "Името не може да биде празно.",
      usernameInvalid: "Корисничкото ime може да содржи само мали букви, бројки и '_' (3–30 знаци).",
      usernameTaken: "Корисничкото ime веќе е зафатено.",
      generic: "Настана грешка. Обиди се повторно.",
      uploadSize: "Сликата мора да биде под 2 MB.",
      uploadType: "Само слики се дозволени.",
      uploadFail: "Грешка при прикачување. Обиди се повторно.",
    },
  },

  leaderboard: {
    title: "Ранг Листа",
    subtitle: "Топ студенти според вкупно освоени поени.",
    yourRank: "Твое место",
    searchPlaceholder: "Пребарај корисник...",
    users: "корисници",
    colRank: "#",
    colUser: "Корисник",
    colLevel: "Ниво",
    colTasks: "Задачи",
    colPoints: "Поени",
    noResults: "Нема резултати за пребарувањето.",
    youBadge: "ти",
  },

  auth: {
    loginTitle: "Најави се",
    loginSub: "Добредојде назад во SQLab FINKI",
    signupTitle: "Регистрирај се",
    signupSub: "Создај нова сметка за SQLab FINKI",
    emailLabel: "E-пошта",
    passwordLabel: "Лозинка",
    loginBtn: "Најава",
    signupBtn: "Регистрација",
    noAccount: "Немаш сметка?",
    hasAccount: "Веќе имаш сметка?",
    signupLink: "Регистрирај се",
    loginLink: "Најави се",
  },
};

// ─────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────
export const en: Translations = {
  locale: "en",
  save: "Save",
  cancel: "Cancel",
  back: "Back",
  loading: "Loading...",
  pts: "pts",
  days: "days",
  day: "day",
  hints: "hints",
  min: "min",

  levels: { 1: "Newcomer", 2: "Apprentice", 3: "Practitioner", 4: "Developer", 5: "Expert", 6: "Master" },
  maxLevel: "Max level",
  ptsToNext: "{pts} pts to next",

  nav: {
    sqlPractice: "SQL Practice",
    startPractice: "Start Practice",
    dashboard: "Dashboard",
    ddl: "DDL",
    dml: "DML",
    triggers: "Triggers",
    erDiagrams: "ER Diagrams",
    settings: "Settings",
    logout: "Log out",
  },

  topbar: {
    searchPlaceholder: "Search tasks...",
    notifications: "Notifications",
    help: "Help",
  },

  help: {
    title: "HELP CENTER",
    beginnerGuide: "Beginner's Guide",
    sqlReference: "SQL Reference",
    faq: "Frequently Asked Questions",
    contact: "Contact Administrator",
  },

  notifications: {
    title: "Notifications",
    markAll: "Mark all read",
    empty: "No new notifications.",
    viewAll: "View all tasks",
    newTasks: (count, label) => `${count} new ${label} task${count === 1 ? "" : "s"}`,
    newTasksBody: (count) => `Can you solve ${count === 1 ? "it" : "them all"}?`,
    leaderboard: "Leaderboard",
    leaderboardBody: (medal) => `You're currently at position ${medal} in the top 10!`,
  },

  dashboard: {
    welcomeTitle: (name) => `Welcome back, ${name}!`,
    welcomeSub: "Your daily SQL practice overview.",
    totalPoints: "Total Points",
    activeStreak: "Active Streak",
    completedTasks: "Completed Tasks",
    keepItUp: "Keep it up!",
    startToday: "Start today",
    leaderboard: "Leaderboard",
    top5: "Top 5",
    fullList: "Full list",
    categories: {
      ddl: { label: "DDL (Data Definition)", desc: "CREATE TABLE, primary keys, constraints" },
      dml: { label: "DML (Data Manipulation)", desc: "SELECT, JOIN, GROUP BY, subqueries" },
      trigger: { label: "Triggers", desc: "BEFORE/AFTER, PL/pgSQL, state testing" },
      er: { label: "ER Diagrams", desc: "Entities, relationships, cardinality" },
    },
  },

  category: {
    activeTasks: "Active Tasks",
    completed: "Completed",
    currentDifficulty: "Current Difficulty",
    availableTasks: "Available Tasks",
    all: "All",
    hard: "Hard",
    searchPlaceholder: "Search tasks...",
    startLink: "Start →",
    viewSolution: "View solution",
    completedBadge: "Completed",
    noResults: "No tasks match your search.",
    difficulty: { 1: "Easy", 2: "Medium", 3: "Hard", 4: "Advanced", 5: "Expert" },
    ddl: {
      title: "DDL — Data Definition",
      subtitle: "CREATE TABLE, primary keys, constraints and indexes. Hands-on tasks for defining relational database structure.",
    },
    dml: {
      title: "DML — Data Manipulation",
      subtitle: "SELECT, JOIN, GROUP BY, subqueries and aggregations. Tasks for writing SQL queries to search and manipulate data.",
    },
    trigger: {
      title: "Triggers",
      subtitle: "BEFORE/AFTER events, PL/pgSQL and state testing. Automate logic directly inside the database.",
    },
    er: {
      title: "ER Diagrams",
      subtitle: "Visual modeling of entities and their relationships. Hands-on tasks for designing relational databases before implementation.",
    },
  },

  task: {
    dashboardLink: "Dashboard",
    categoryLabels: { dml: "DML Task", ddl: "DDL Task", trigger: "Trigger Task", er: "ER Task", relations: "Relations Task" },
    checkCode: "Check code",
    taskSection: "Task",
    schemaSection: "ER Diagram / Schema",
    hintsSection: "Help (Hints)",
    hint: (n) => `Hint ${n}`,
    editorLabel: "SQL_EDITOR.SQL",
    formatBtn: "Format",
    clearBtn: "Clear",
    resultsTab: "Results",
    logTab: "Output log",
    noResults: "No queries executed",
    noResultsSub: "Write a query and press the button to see results here.",
    logNoData: "-- No log yet",
    points: "pts",
  },

  profile: {
    title: "Student Profile",
    subtitle: "Overview of academic achievements and activity.",
    achievementsTitle: "Achievements",
    achievementsSub: "Collect all badges and show who's the best.",
    earnedOf: (e, t) => `${e} / ${t} earned`,
    totalPoints: "TOTAL POINTS",
    completedTasks: "COMPLETED TASKS",
    currentStreak: "CURRENT STREAK",
    recentActivity: "Recent Activity",
    noActivity: "No activity yet. Start practicing!",
    correct: "Correct: ",
    attempt: "Attempt: ",
    enrolled: (y) => `Enrolled ${y}`,
    editBtn: "Edit",
    badgeGroups: { progress: "Progress", speed: "Speed", accuracy: "Accuracy", category: "Categories", streak: "Streak", points: "Points" },
    badges: {
      first_blood:  { label: "First Blood",    sub: "First correct solution"   },
      solver:       { label: "Solver",         sub: "5 tasks solved"           },
      veteran:      { label: "Veteran",        sub: "All tasks solved"         },
      fast:         { label: "Fast Solver",    sub: "Correct in under 5 min"   },
      lightning:    { label: "Lightning",      sub: "Correct in under 90 sec"  },
      sprinter:     { label: "Sprinter",       sub: "3 tasks under 5 min"      },
      first_try:    { label: "First Try",      sub: "Correct on first attempt" },
      no_hints:     { label: "No Hints",       sub: "Correct without hints"    },
      clean_sheet:  { label: "Clean Sheet",    sub: "5 tasks without hints"    },
      ddl_pro:      { label: "DDL Pro",        sub: "All DDL tasks"            },
      dml_pro:      { label: "DML Pro",        sub: "All DML tasks"            },
      trigger_guru: { label: "Trigger Guru",   sub: "All Trigger tasks"        },
      explorer:     { label: "Explorer",       sub: "3+ categories solved"     },
      streak3:      { label: "Regular",        sub: "3 days in a row"          },
      streak7:      { label: "Consistent",     sub: "7 days in a row"          },
      collector:    { label: "Collector",      sub: "500+ points"              },
      expert:       { label: "Expert",         sub: "1,000+ points"            },
      champion:     { label: "Champion",       sub: "2,000+ points"            },
    },
  },

  profileEdit: {
    title: "Edit Profile",
    displayNameLabel: "Display Name",
    displayNamePlaceholder: "e.g. Peter T.",
    usernameLabel: "Username",
    usernamePlaceholder: "peter_t",
    usernameHint: "Lowercase letters, numbers and _ · 3–30 chars · optional",
    emailLabel: "Email",
    emailHint: "Email cannot be changed.",
    avatarHint: "JPG, PNG · max 2 MB",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    errors: {
      nameRequired: "Name cannot be empty.",
      usernameInvalid: "Username can only contain lowercase letters, numbers and '_' (3–30 chars).",
      usernameTaken: "Username is already taken.",
      generic: "Something went wrong. Please try again.",
      uploadSize: "Image must be under 2 MB.",
      uploadType: "Only images are allowed.",
      uploadFail: "Upload failed. Please try again.",
    },
  },

  leaderboard: {
    title: "Leaderboard",
    subtitle: "Top students by total points earned.",
    yourRank: "Your rank",
    searchPlaceholder: "Search user...",
    users: "users",
    colRank: "#",
    colUser: "User",
    colLevel: "Level",
    colTasks: "Tasks",
    colPoints: "Points",
    noResults: "No results for this search.",
    youBadge: "you",
  },

  auth: {
    loginTitle: "Sign in",
    loginSub: "Welcome back to SQLab FINKI",
    signupTitle: "Create account",
    signupSub: "Create a new SQLab FINKI account",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginBtn: "Sign in",
    signupBtn: "Create account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signupLink: "Sign up",
    loginLink: "Sign in",
  },
};

export const translations: Record<Locale, Translations> = { mk, en };
