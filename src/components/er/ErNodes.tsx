"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import styles from "./ErNodes.module.css";

// ── Entity node ───────────────────────────────────────────────
export function EntityNode({ data, selected }: NodeProps) {
  return (
    <div className={`${styles.entity} ${data.isWeak ? styles.weak : ""} ${selected ? styles.selected : ""}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <span className={styles.entityLabel}>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

// ── Attribute node ────────────────────────────────────────────
export function AttributeNode({ data, selected }: NodeProps) {
  return (
    <div className={`
      ${styles.attribute}
      ${data.isKey ? styles.keyAttr : ""}
      ${data.isMultivalued ? styles.multiAttr : ""}
      ${data.isDerived ? styles.derivedAttr : ""}
      ${selected ? styles.selected : ""}
    `}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <span className={`${styles.attrLabel} ${data.isKey ? styles.keyLabel : ""}`}>
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}

// ── Relationship node ─────────────────────────────────────────
export function RelationshipNode({ data, selected }: NodeProps) {
  return (
    <div className={`${styles.relationship} ${data.isIdentifying ? styles.identifying : ""} ${selected ? styles.selected : ""}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <span className={styles.relLabel}>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
}
