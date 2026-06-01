-- ============================================================
-- 004_seed_trigger_task.sql — 1 trigger practice task
-- ============================================================

insert into public.tasks
  (category, difficulty, title, prompt, setup_sql, seed_sql, reference_solution, test_cases, hints, walkthrough, tags, points, source, verified)
values
(
  'trigger', 3,
  'Тригер за евиденција на избришани производи',
  E'Дадени се двете табели подолу.\n\nНапиши тригер функција и тригер кој автоматски, пред бришење на ред од табелата "products", го копира бришениот ред во табелата "deleted_products".\n\nПолињата во deleted_products се:\n- product_id (id на производот)\n- name (ime на производот)\n- price (цена)\n- deleted_at (стандардно NOW())',
  $setup$
CREATE TABLE products (
  id    serial PRIMARY KEY,
  name  text NOT NULL,
  price numeric(8,2) NOT NULL
);

CREATE TABLE deleted_products (
  id         serial PRIMARY KEY,
  product_id integer NOT NULL,
  name       text NOT NULL,
  price      numeric(8,2) NOT NULL,
  deleted_at timestamptz NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, price) VALUES
  ('Лаптоп',    54999.00),
  ('Маус',       1299.00),
  ('Тастатура',  2499.00);
  $setup$,
  '',
  $ref$
CREATE OR REPLACE FUNCTION log_deleted_product()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO deleted_products (product_id, name, price)
  VALUES (OLD.id, OLD.name, OLD.price);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_deleted_product
BEFORE DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION log_deleted_product();
  $ref$,
  $tc$[
    {
      "description": "Бришење на еден производ → 1 запис во deleted_products",
      "sql": "DELETE FROM products WHERE name = 'Маус';",
      "should_raise": false,
      "expected_state": { "table": "deleted_products", "row_count": 1 }
    },
    {
      "description": "Бришење на уште еден производ → 2 записи во deleted_products",
      "sql": "DELETE FROM products WHERE name = 'Тастатура';",
      "should_raise": false,
      "expected_state": { "table": "deleted_products", "row_count": 2 }
    },
    {
      "description": "Избришаниот производ е зачуван со точно ime",
      "sql": "SELECT 1;",
      "should_raise": false,
      "expected_state": {
        "query": "SELECT COUNT(*)::int FROM deleted_products WHERE name = 'Маус'",
        "expected_value": 1
      }
    },
    {
      "description": "Производот е навистина избришан од products",
      "sql": "SELECT 1;",
      "should_raise": false,
      "expected_state": {
        "query": "SELECT COUNT(*)::int FROM products",
        "expected_value": 1
      }
    }
  ]$tc$,
  $hints$[
    {"level":1,"text":"Тригерот работи BEFORE DELETE, за да може да го прочита OLD (редот пред бришење).","score_penalty":10},
    {"level":2,"text":"Тригер функцијата мора да враќа TRIGGER и да користи OLD.column_name за да ги земе вредностите на бришениот ред.","score_penalty":15},
    {"level":3,"text":"Структура:\nCREATE OR REPLACE FUNCTION fn() RETURNS TRIGGER AS $$ BEGIN INSERT INTO deleted_products(...) VALUES (OLD.id, OLD.name, OLD.price); RETURN OLD; END; $$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg BEFORE DELETE ON products FOR EACH ROW EXECUTE FUNCTION fn();","score_penalty":20}
  ]$hints$,
  $wt$[
    {"step":1,"explanation":"Дефинирај тригер функција: CREATE OR REPLACE FUNCTION log_deleted_product() RETURNS TRIGGER"},
    {"step":2,"explanation":"Во телото: INSERT INTO deleted_products (product_id, name, price) VALUES (OLD.id, OLD.name, OLD.price)"},
    {"step":3,"explanation":"RETURN OLD — за BEFORE DELETE тригерот, враќање на OLD го дозволува бришењето"},
    {"step":4,"explanation":"CREATE TRIGGER ... BEFORE DELETE ON products FOR EACH ROW EXECUTE FUNCTION log_deleted_product()"}
  ]$wt$,
  ARRAY['Trigger','BEFORE DELETE','OLD','plpgsql'],
  150, 'manual', true
);
