-- ============================================================
-- 002_seed_dml_tasks.sql — 5 hand-written DML practice tasks
-- ============================================================

insert into public.tasks
  (category, difficulty, title, prompt, setup_sql, seed_sql, reference_solution, hints, walkthrough, tags, points, source, verified)
values

-- ----------------------------------------------------------------
-- Task 1 — difficulty 1: simple SELECT + WHERE
-- ----------------------------------------------------------------
(
  'dml', 1,
  'Студенти од трета година',
  'Прикажи ги имињата (name) на сите студенти кои се во трета година (year = 3). Подреди ги по азбучен ред.',
  $setup$
CREATE TABLE students (
  id   serial primary key,
  name text not null,
  year smallint not null,
  gpa  numeric(3,2)
);
  $setup$,
  $seed$
INSERT INTO students (name, year, gpa) VALUES
  ('Ана Петровска',    3, 9.20),
  ('Борис Јовановски', 1, 8.50),
  ('Сара Костовска',   3, 9.75),
  ('Давид Ангеловски', 2, 7.80),
  ('Ема Димовска',     3, 8.90),
  ('Филип Стојановски',1, 9.10);
  $seed$,
  'SELECT name FROM students WHERE year = 3 ORDER BY name;',
  '[
    {"level":1,"text":"Користи SELECT и WHERE за да ги филтрираш редовите по колоната year.","score_penalty":10},
    {"level":2,"text":"Додај ORDER BY name за азбучно подредување.","score_penalty":10}
  ]',
  '[
    {"step":1,"explanation":"Одреди ги колоните: SELECT name"},
    {"step":2,"explanation":"Одреди ја табелата: FROM students"},
    {"step":3,"explanation":"Филтрирај: WHERE year = 3"},
    {"step":4,"explanation":"Подреди: ORDER BY name"}
  ]',
  ARRAY['SELECT','WHERE','ORDER BY'],
  100, 'manual', true
),

-- ----------------------------------------------------------------
-- Task 2 — difficulty 1: aggregate COUNT
-- ----------------------------------------------------------------
(
  'dml', 1,
  'Број на производи по категорија',
  'За секоја категорија (category) прикажи го нејзиното име и бројот на производи. Подреди ги по број на производи опаѓачки.',
  $setup$
CREATE TABLE products (
  id       serial primary key,
  name     text not null,
  category text not null,
  price    numeric(8,2) not null
);
  $setup$,
  $seed$
INSERT INTO products (name, category, price) VALUES
  ('Лаптоп',        'Електроника', 54999.00),
  ('Маус',          'Електроника',  1299.00),
  ('Тастатура',     'Електроника',  2499.00),
  ('Стол',          'Мебел',        8999.00),
  ('Биро',          'Мебел',       14999.00),
  ('Тефтер',        'Канцеларија',   149.00),
  ('Хемиска',       'Канцеларија',    29.00),
  ('Монитор',       'Електроника', 19999.00);
  $seed$,
  'SELECT category, COUNT(*) AS product_count FROM products GROUP BY category ORDER BY product_count DESC;',
  '[
    {"level":1,"text":"Треба ти GROUP BY за да ги групираш редовите по категорија.","score_penalty":10},
    {"level":2,"text":"Користи COUNT(*) за да го броиш бројот на редови во секоја група.","score_penalty":15}
  ]',
  '[
    {"step":1,"explanation":"SELECT category — ја земаш колоната за групирање"},
    {"step":2,"explanation":"COUNT(*) AS product_count — ги бројиш производите"},
    {"step":3,"explanation":"FROM products GROUP BY category — групираш по категорија"},
    {"step":4,"explanation":"ORDER BY product_count DESC — опаѓачко подредување"}
  ]',
  ARRAY['SELECT','GROUP BY','COUNT','ORDER BY'],
  100, 'manual', true
),

-- ----------------------------------------------------------------
-- Task 3 — difficulty 2: INNER JOIN
-- ----------------------------------------------------------------
(
  'dml', 2,
  'Студенти и нивните оддели',
  'Прикажи го името на секој студент (student_name) и името на неговиот оддел (department_name). Подреди ги по ime на студентот.',
  $setup$
CREATE TABLE departments (
  id   serial primary key,
  name text not null
);
CREATE TABLE students (
  id            serial primary key,
  name          text not null,
  department_id integer references departments(id)
);
  $setup$,
  $seed$
INSERT INTO departments (name) VALUES
  ('Компјутерски науки'),
  ('Информатика'),
  ('Софтверско инженерство');
INSERT INTO students (name, department_id) VALUES
  ('Ана Петровска',     1),
  ('Борис Јовановски',  3),
  ('Сара Костовска',    1),
  ('Давид Ангеловски',  2),
  ('Ема Димовска',      2);
  $seed$,
  'SELECT s.name AS student_name, d.name AS department_name FROM students s JOIN departments d ON s.department_id = d.id ORDER BY s.name;',
  '[
    {"level":1,"text":"Треба да поврзеш две табели. Користи JOIN ... ON за да ги споиш студентите со нивните оддели.","score_penalty":15},
    {"level":2,"text":"JOIN departments d ON s.department_id = d.id — поврзи ги преку клучот department_id.","score_penalty":15}
  ]',
  '[
    {"step":1,"explanation":"Идентификувај ги двете табели: students и departments"},
    {"step":2,"explanation":"Поврзи ги: JOIN departments d ON s.department_id = d.id"},
    {"step":3,"explanation":"Избери ги колоните со алијаси: s.name AS student_name, d.name AS department_name"},
    {"step":4,"explanation":"Подреди: ORDER BY s.name"}
  ]',
  ARRAY['SELECT','JOIN','ON','ORDER BY'],
  100, 'manual', true
),

-- ----------------------------------------------------------------
-- Task 4 — difficulty 2: GROUP BY + HAVING
-- ----------------------------------------------------------------
(
  'dml', 2,
  'Оддели со висока просечна плата',
  'Прикажи го името на одделот (department) и просечната плата (avg_salary, заокружена на 2 децимали) само за оние оддели каде просечната плата е поголема од 50000. Подреди ги по avg_salary опаѓачки.',
  $setup$
CREATE TABLE employees (
  id         serial primary key,
  name       text not null,
  department text not null,
  salary     numeric(10,2) not null
);
  $setup$,
  $seed$
INSERT INTO employees (name, department, salary) VALUES
  ('Ана',    'Инженеринг',  72000),
  ('Борис',  'Инженеринг',  68000),
  ('Сара',   'Маркетинг',   45000),
  ('Давид',  'Маркетинг',   48000),
  ('Ема',    'Финансии',    85000),
  ('Филип',  'Финансии',    91000),
  ('Горан',  'Поддршка',    38000),
  ('Хана',   'Поддршка',    41000);
  $seed$,
  'SELECT department, ROUND(AVG(salary), 2) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 50000 ORDER BY avg_salary DESC;',
  '[
    {"level":1,"text":"GROUP BY department ги групира вработените по оддел. Потоа користи AVG(salary) за просекот.","score_penalty":10},
    {"level":2,"text":"HAVING го филтрира резултатот по групирањето — за разлика од WHERE кој филтрира пред групирање.","score_penalty":15},
    {"level":3,"text":"HAVING AVG(salary) > 50000 — задржи само групи каде просекот е над 50000.","score_penalty":10}
  ]',
  '[
    {"step":1,"explanation":"SELECT department, ROUND(AVG(salary), 2) AS avg_salary"},
    {"step":2,"explanation":"FROM employees GROUP BY department — групирај по оддел"},
    {"step":3,"explanation":"HAVING AVG(salary) > 50000 — филтрирај групи (не редови!)"},
    {"step":4,"explanation":"ORDER BY avg_salary DESC — опаѓачко подредување"}
  ]',
  ARRAY['SELECT','GROUP BY','HAVING','AVG','ORDER BY'],
  100, 'manual', true
),

-- ----------------------------------------------------------------
-- Task 5 — difficulty 3: subquery + JOIN
-- ----------------------------------------------------------------
(
  'dml', 3,
  'Нарачки над просекот',
  'Прикажи го името на клиентот (customer_name) и вредноста на нарачката (amount) за сите нарачки чија вредност е поголема од просечната вредност на сите нарачки. Подреди ги по amount опаѓачки.',
  $setup$
CREATE TABLE customers (
  id   serial primary key,
  name text not null
);
CREATE TABLE orders (
  id          serial primary key,
  customer_id integer references customers(id),
  amount      numeric(10,2) not null
);
  $setup$,
  $seed$
INSERT INTO customers (name) VALUES
  ('Ана Петровска'),
  ('Борис Јовановски'),
  ('Сара Костовска'),
  ('Давид Ангеловски');
INSERT INTO orders (customer_id, amount) VALUES
  (1, 1200.00),
  (2,  450.00),
  (1, 3400.00),
  (3,  890.00),
  (4, 5600.00),
  (2, 2100.00),
  (3,  300.00);
  $seed$,
  'SELECT c.name AS customer_name, o.amount FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.amount > (SELECT AVG(amount) FROM orders) ORDER BY o.amount DESC;',
  '[
    {"level":1,"text":"Треба ти потупрашување (subquery) за да ја пресметаш просечната вредност: SELECT AVG(amount) FROM orders.","score_penalty":15},
    {"level":2,"text":"Користи го потупрашувањето во WHERE: WHERE o.amount > (SELECT AVG(amount) FROM orders).","score_penalty":15},
    {"level":3,"text":"JOIN customers c ON o.customer_id = c.id — поврзи за да го добиеш името на клиентот.","score_penalty":10}
  ]',
  '[
    {"step":1,"explanation":"Пресметај го просекот со потупрашување: (SELECT AVG(amount) FROM orders)"},
    {"step":2,"explanation":"JOIN customers за да го добиеш customer_name"},
    {"step":3,"explanation":"WHERE o.amount > (подупрашување) — филтрирај над просекот"},
    {"step":4,"explanation":"ORDER BY o.amount DESC"}
  ]',
  ARRAY['SELECT','JOIN','WHERE','Subquery','AVG','ORDER BY'],
  150, 'manual', true
);
