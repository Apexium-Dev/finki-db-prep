-- ============================================================
-- 003_seed_ddl_tasks.sql — 2 hand-written DDL practice tasks
-- ============================================================

insert into public.tasks
  (category, difficulty, title, prompt, setup_sql, seed_sql, reference_solution, test_cases, hints, walkthrough, tags, points, source, verified)
values

-- ----------------------------------------------------------------
-- Task 1 — difficulty 2: single table with PK, NOT NULL, types
-- ----------------------------------------------------------------
(
  'ddl', 2,
  'Креирај табела за книги',
  E'Креирај табела "books" со следните колони:\n- id: цел број, примарен клуч\n- title: текст, задолжително\n- author: текст, задолжително\n- year_published: цел број\n- price: децимален број (8 цифри, 2 децимали), задолжително\n- in_stock: булова вредност, стандардно TRUE',
  '',
  '',
  $ref$
CREATE TABLE books (
  id             serial PRIMARY KEY,
  title          text NOT NULL,
  author         text NOT NULL,
  year_published integer,
  price          numeric(8,2) NOT NULL,
  in_stock       boolean DEFAULT TRUE
);
  $ref$,
  $tc$[
    {"aspect":"table_exists",  "table":"books"},
    {"aspect":"primary_key",   "table":"books", "column":"id"},
    {"aspect":"column_type",   "table":"books", "column":"title",          "expected_type":"text"},
    {"aspect":"not_null",      "table":"books", "column":"title"},
    {"aspect":"column_type",   "table":"books", "column":"author",         "expected_type":"text"},
    {"aspect":"not_null",      "table":"books", "column":"author"},
    {"aspect":"column_type",   "table":"books", "column":"year_published",  "expected_type":"integer"},
    {"aspect":"column_type",   "table":"books", "column":"price",           "expected_type":"numeric"},
    {"aspect":"not_null",      "table":"books", "column":"price"},
    {"aspect":"column_type",   "table":"books", "column":"in_stock",        "expected_type":"boolean"}
  ]$tc$,
  $hints$[
    {"level":1,"text":"Секоја колона се декларира со: ime_kolona TIP [OGRANICUVANJA].","score_penalty":5},
    {"level":2,"text":"PRIMARY KEY може да се декларира inline: id serial PRIMARY KEY или преку CONSTRAINT на крај.","score_penalty":10},
    {"level":3,"text":"Провери ги типовите: text, integer, numeric(8,2), boolean. NOT NULL се пишува директно после типот.","score_penalty":10}
  ]$hints$,
  $wt$[
    {"step":1,"explanation":"CREATE TABLE books ( ... ) — започни ја дефиницијата"},
    {"step":2,"explanation":"id serial PRIMARY KEY — serial автоматски инкрементира"},
    {"step":3,"explanation":"title text NOT NULL, author text NOT NULL — текстуални колони"},
    {"step":4,"explanation":"year_published integer — опционална колона, без NOT NULL"},
    {"step":5,"explanation":"price numeric(8,2) NOT NULL — прецизен децимален тип"},
    {"step":6,"explanation":"in_stock boolean DEFAULT TRUE — булова со стандардна вредност"}
  ]$wt$,
  ARRAY['DDL','CREATE TABLE','PRIMARY KEY','NOT NULL','DEFAULT'],
  100, 'manual', true
),

-- ----------------------------------------------------------------
-- Task 2 — difficulty 3: two tables with FK + UNIQUE + NOT NULL
-- ----------------------------------------------------------------
(
  'ddl', 3,
  'Табели за нарачки со странски клуч',
  E'Креирај две табели:\n\n1. "customers"\n   - id: цел број, примарен клуч\n   - email: текст, единствен (UNIQUE), задолжително\n   - name: текст, задолжително\n\n2. "orders"\n   - id: цел број, примарен клуч\n   - customer_id: цел број, задолжително, странски клуч кон customers(id)\n   - total: numeric(10,2), задолжително\n   - created_at: timestamp, стандардно NOW()',
  '',
  '',
  $ref$
CREATE TABLE customers (
  id    serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name  text NOT NULL
);
CREATE TABLE orders (
  id          serial PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers(id),
  total       numeric(10,2) NOT NULL,
  created_at  timestamp DEFAULT NOW()
);
  $ref$,
  $tc$[
    {"aspect":"table_exists",  "table":"customers"},
    {"aspect":"primary_key",   "table":"customers", "column":"id"},
    {"aspect":"not_null",      "table":"customers", "column":"email"},
    {"aspect":"unique",        "table":"customers", "column":"email"},
    {"aspect":"not_null",      "table":"customers", "column":"name"},
    {"aspect":"table_exists",  "table":"orders"},
    {"aspect":"primary_key",   "table":"orders", "column":"id"},
    {"aspect":"not_null",      "table":"orders", "column":"customer_id"},
    {"aspect":"foreign_key",   "table":"orders", "column":"customer_id", "references_table":"customers"},
    {"aspect":"column_type",   "table":"orders", "column":"total",       "expected_type":"numeric"},
    {"aspect":"not_null",      "table":"orders", "column":"total"}
  ]$tc$,
  $hints$[
    {"level":1,"text":"Прво креирај ја табелата customers, па дури потоа orders — поради странскиот клуч.","score_penalty":5},
    {"level":2,"text":"UNIQUE се пишува после типот: email text NOT NULL UNIQUE","score_penalty":10},
    {"level":3,"text":"Странски клуч: customer_id integer NOT NULL REFERENCES customers(id)","score_penalty":15}
  ]$hints$,
  $wt$[
    {"step":1,"explanation":"Прво CREATE TABLE customers — reference табелата мора да постои пред FK"},
    {"step":2,"explanation":"email text NOT NULL UNIQUE — NOT NULL и UNIQUE можат да се комбинираат"},
    {"step":3,"explanation":"CREATE TABLE orders — dependant табела"},
    {"step":4,"explanation":"customer_id integer NOT NULL REFERENCES customers(id) — FK со inline синтакса"},
    {"step":5,"explanation":"created_at timestamp DEFAULT NOW() — стандардна вредност со функција"}
  ]$wt$,
  ARRAY['DDL','CREATE TABLE','PRIMARY KEY','FOREIGN KEY','UNIQUE','NOT NULL','DEFAULT'],
  150, 'manual', true
);
