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

const NODE_W = 200;
const NODE_H_BASE = 36;   // header
const NODE_H_ROW = 26;    // per column
const COL_GAP = 70;
const ROW_GAP = 40;
const COLS_PER_ROW = 3;

function layoutNodes(tables: TableDef[]): Node[] {
  return tables.map((table, i) => {
    const col = i % COLS_PER_ROW;
    const row = Math.floor(i / COLS_PER_ROW);
    const prevRowHeight = row === 0 ? 0 : tables
      .slice(0, row * COLS_PER_ROW)
      .reduce((maxH, _, j) => {
        const rowIdx = Math.floor(j / COLS_PER_ROW);
        if (rowIdx !== row - 1) return maxH;
        const h = NODE_H_BASE + tables[j].columns.length * NODE_H_ROW;
        return Math.max(maxH, h);
      }, 0) + ROW_GAP;

    return {
      id: table.name,
      type: "table",
      position: {
        x: col * (NODE_W + COL_GAP),
        y: prevRowHeight,
      },
      data: table,
      draggable: false,
      selectable: false,
    };
  });
}

export default function SchemaViewer({ setupSql }: { setupSql: string }) {
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
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
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
