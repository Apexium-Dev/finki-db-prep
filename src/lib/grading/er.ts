import type { ErGraph, ErEntity, ErRelationship } from "@/types/er";

export interface ErAspectResult {
  label: string;
  passed: boolean;
  detail?: string;
}

export interface ErGradingResult {
  passed: boolean;
  score: number;
  maxScore: number;
  aspects: ErAspectResult[];
  error: string | null;
}

const norm = (s: string) => s.trim().toLowerCase();

function findEntity(graph: ErGraph, name: string): ErEntity | undefined {
  return graph.entities.find((e) => norm(e.name) === norm(name));
}

function findRelationship(graph: ErGraph, name: string): ErRelationship | undefined {
  return graph.relationships.find((r) => norm(r.name) === norm(name));
}

export function gradeEr(student: ErGraph, reference: ErGraph): ErGradingResult {
  const aspects: ErAspectResult[] = [];

  // ── Entities ──────────────────────────────────────────────
  for (const refEntity of reference.entities) {
    const stuEntity = findEntity(student, refEntity.name);
    const exists = !!stuEntity;

    aspects.push({
      label: `Ентитет "${refEntity.name}" постои`,
      passed: exists,
    });

    if (!exists) {
      // Skip attribute checks for missing entity
      for (const attr of refEntity.attributes) {
        aspects.push({
          label: `Атрибут "${attr.name}" на "${refEntity.name}"`,
          passed: false,
          detail: "Ентитетот не постои",
        });
      }
      continue;
    }

    // Weak entity flag
    if (refEntity.isWeak) {
      aspects.push({
        label: `"${refEntity.name}" е слаб ентитет`,
        passed: stuEntity.isWeak,
      });
    }

    // Attributes
    for (const refAttr of refEntity.attributes) {
      const stuAttr = stuEntity.attributes.find(
        (a) => norm(a.name) === norm(refAttr.name)
      );
      const attrExists = !!stuAttr;

      aspects.push({
        label: `Атрибут "${refAttr.name}" на "${refEntity.name}"`,
        passed: attrExists,
      });

      if (attrExists) {
        if (refAttr.isKey) {
          aspects.push({
            label: `"${refAttr.name}" е примарен атрибут (клуч)`,
            passed: stuAttr!.isKey,
          });
        }
        if (refAttr.isMultivalued) {
          aspects.push({
            label: `"${refAttr.name}" е повеќевреден атрибут`,
            passed: stuAttr!.isMultivalued,
          });
        }
        if (refAttr.isDerived) {
          aspects.push({
            label: `"${refAttr.name}" е изведен атрибут`,
            passed: stuAttr!.isDerived,
          });
        }
      }
    }
  }

  // ── Relationships ─────────────────────────────────────────
  for (const refRel of reference.relationships) {
    const stuRel = findRelationship(student, refRel.name);
    const exists = !!stuRel;

    aspects.push({
      label: `Врска "${refRel.name}" постои`,
      passed: exists,
    });

    if (!exists) {
      for (const p of refRel.participants) {
        aspects.push({
          label: `Кардиналност ${p.cardinality} за "${p.entityName}" во "${refRel.name}"`,
          passed: false,
          detail: "Врската не постои",
        });
      }
      continue;
    }

    // Cardinalities
    for (const refPart of refRel.participants) {
      const stuPart = stuRel.participants.find(
        (p) => norm(p.entityName) === norm(refPart.entityName)
      );
      const cardOk = stuPart?.cardinality === refPart.cardinality;
      aspects.push({
        label: `Кардиналност ${refPart.cardinality} за "${refPart.entityName}" во "${refRel.name}"`,
        passed: cardOk,
        detail: cardOk ? undefined : `Добиено: ${stuPart?.cardinality ?? "не е поврзано"}`,
      });
    }
  }

  const passed_count = aspects.filter((a) => a.passed).length;
  const passed = passed_count === aspects.length;

  return {
    passed,
    score: passed_count,
    maxScore: aspects.length,
    aspects,
    error: null,
  };
}
