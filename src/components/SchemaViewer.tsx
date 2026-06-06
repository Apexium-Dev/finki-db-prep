"use client";

import ReactFlow, {
  Background,
  type Node,
  type Edge,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { parseSqlSchema, type TableDef, type ColumnDef } from "@/lib/schemaParse";
import styles from "./SchemaViewer.module.css";

function ColIcon({ col }: { col: ColumnDef }) {
  if (col.isPrimary) return <span className={styles.iconPK} title="Primary Key">PK</span>;
  if (col.references) return <span className={styles.iconFK} title="Foreign Key">FK</span>;
  return <span className={styles.iconCol}>◦</span>;
}

function TableNode({ data }: { data: TableDef }) {
  return (
    <div className={styles.tableNode}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className={styles.tableHeader}>{data.name}</div>
      <div className={styles.tableBody}>
        {data.columns.map((col) => (
          <div
            key={col.name}
            className={`${styles.colRow} ${col.isPrimary ? styles.colPK : col.references ? styles.colFK : ""}`}
          >
            <ColIcon col={col} />
            <span className={styles.colName}>{col.name}</span>
            <span className={styles.colType}>{col.type}</span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const NODE_TYPES = { table: TableNode };

const NODE_W = 250;
const NODE_H_BASE = 36;
const NODE_H_ROW = 26;
const COL_GAP = 90;
const ROW_GAP = 60;

function tableHeight(t: TableDef) {
  return NODE_H_BASE + t.columns.length * NODE_H_ROW;
}

function layoutNodes(tables: TableDef[]): Node[] {
  const tableNames = new Set(tables.map(t => t.name));

  // Build adjacency: which tables does each table reference?
  const refs = new Map<string, Set<string>>();
  for (const t of tables) {
    refs.set(t.name, new Set());
    for (const col of t.columns) {
      if (col.references && tableNames.has(col.references.table) && col.references.table !== t.name) {
        refs.get(t.name)!.add(col.references.table);
      }
    }
  }

  // Assign depth level: root tables (no outgoing refs in schema) = level 0
  // Tables that reference level-N tables = level N+1
  // Use iterative relaxation to handle cycles gracefully
  const level = new Map<string, number>();
  for (const t of tables) level.set(t.name, 0);

  for (let iter = 0; iter < tables.length; iter++) {
    let changed = false;
    for (const t of tables) {
      for (const dep of refs.get(t.name) ?? []) {
        const proposed = (level.get(dep) ?? 0) + 1;
        if (proposed > (level.get(t.name) ?? 0)) {
          level.set(t.name, proposed);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  // Group tables by level
  const byLevel = new Map<number, TableDef[]>();
  for (const t of tables) {
    const lv = level.get(t.name) ?? 0;
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(t);
  }

  const sortedLevels = Array.from(byLevel.keys()).sort((a, b) => a - b);

  // Compute Y for each level (cumulative max row height)
  const levelY: number[] = [];
  let curY = 0;
  for (const lv of sortedLevels) {
    levelY.push(curY);
    const rowH = Math.max(...byLevel.get(lv)!.map(tableHeight));
    curY += rowH + ROW_GAP;
  }

  const nodes: Node[] = [];
  for (let li = 0; li < sortedLevels.length; li++) {
    const lv = sortedLevels[li];
    const row = byLevel.get(lv)!;
    const rowW = row.length * NODE_W + (row.length - 1) * COL_GAP;
    const startX = -rowW / 2; // center each row
    row.forEach((table, ci) => {
      nodes.push({
        id: table.name,
        type: "table",
        position: { x: startX + ci * (NODE_W + COL_GAP), y: levelY[li] },
        data: table,
        draggable: true,
        selectable: false,
      });
    });
  }
  return nodes;
}

export default function SchemaViewer({ setupSql, height }: { setupSql: string; height?: number | string }) {
  const tables = parseSqlSchema(setupSql);

  if (tables.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Нема дефинирана шема за оваа задача.</p>
      </div>
    );
  }

  const nodes = layoutNodes(tables);

  const edges: Edge[] = [];
  tables.forEach((table) => {
    table.columns.forEach((col) => {
      if (col.references && tables.find((t) => t.name === col.references!.table)) {
        edges.push({
          id: `${table.name}.${col.name}->${col.references.table}`,
          source: table.name,
          target: col.references.table,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#41ead4" },
          style: { stroke: "#41ead4", strokeWidth: 1.5 },
          animated: false,
        });
      }
    });
  });

  return (
    <div className={styles.container} style={height !== undefined ? { height } : undefined}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll
        panOnDrag
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e3a5f" gap={20} size={0.8} />
      </ReactFlow>
    </div>
  );
}
