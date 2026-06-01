-- ============================================================
-- 006_seed_er_task.sql — 1 ER diagram practice task
-- ============================================================

insert into public.tasks
  (category, difficulty, title, prompt, setup_sql, seed_sql, reference_solution, hints, walkthrough, tags, points, source, verified)
values
(
  'er', 3,
  'ER дијаграм: Студенти и предмети',
  E'Нацртај ER дијаграм за следниот опис:\n\nФакултет евидентира студенти и предмети. Секој студент има единствен индекс (примарен атрибут), ime и prezime. Секој предмет има шифра (примарен атрибут) и назив.\n\nСтудентите се запишуваат на предмети (врска "Запишува"). Еден студент може да биде запишан на повеќе предмети, а еден предмет може да имаат запишано повеќе студенти (M:N).\n\nУпатство:\n1. Додај ентитет "Student" со атрибути: indeks (клуч), ime, prezime\n2. Додај ентитет "Predmet" со атрибути: sifra (клуч), naziv\n3. Додај врска "Zapishuva" помеѓу нив\n4. Постави кардиналност N за Student и M за Predmet',
  '',
  '',
  $ref${
    "entities": [
      {
        "name": "Student",
        "isWeak": false,
        "attributes": [
          {"name": "indeks", "isKey": true, "isMultivalued": false, "isDerived": false},
          {"name": "ime", "isKey": false, "isMultivalued": false, "isDerived": false},
          {"name": "prezime", "isKey": false, "isMultivalued": false, "isDerived": false}
        ]
      },
      {
        "name": "Predmet",
        "isWeak": false,
        "attributes": [
          {"name": "sifra", "isKey": true, "isMultivalued": false, "isDerived": false},
          {"name": "naziv", "isKey": false, "isMultivalued": false, "isDerived": false}
        ]
      }
    ],
    "relationships": [
      {
        "name": "Zapishuva",
        "isIdentifying": false,
        "participants": [
          {"entityName": "Student", "cardinality": "N", "participation": "partial"},
          {"entityName": "Predmet", "cardinality": "M", "participation": "partial"}
        ]
      }
    ]
  }$ref$,
  $hints$[
    {"level":1,"text":"Почни со двата ентитети: Student и Predmet. Секој ентитет се претставува со правоаголник.","score_penalty":10},
    {"level":2,"text":"Атрибутите се претставуваат со елипси поврзани со ентитетот. Примарниот атрибут (клуч) е подвлечен.","score_penalty":10},
    {"level":3,"text":"Врската M:N значи: постави кардиналност N на страната на Student и M на страната на Predmet.","score_penalty":15}
  ]$hints$,
  $wt$[
    {"step":1,"explanation":"Додај ентитет 'Student' (□) и ентитет 'Predmet' (□)"},
    {"step":2,"explanation":"На Student додај атрибути: indeks (○, клуч — подвлечен), ime (○), prezime (○)"},
    {"step":3,"explanation":"На Predmet додај атрибути: sifra (○, клуч), naziv (○)"},
    {"step":4,"explanation":"Додај врска 'Zapishuva' (◇) и поврзи ја со Student (кардиналност N) и Predmet (кардиналност M)"}
  ]$wt$,
  ARRAY['ER','Entity','Attribute','Relationship','M:N'],
  150, 'manual', true
);
