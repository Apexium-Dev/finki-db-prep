"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { EntityNode, AttributeNode, RelationshipNode } from "./ErNodes";
import type { ErGraph } from "@/types/er";
import styles from "./ErEditor.module.css";

const NODE_TYPES = {
  entity: EntityNode,
  attribute: AttributeNode,
  relationship: RelationshipNode,
};

const CARDINALITIES = ["1", "N", "M"] as const;

let nodeId = 1;
const uid = () => `n${nodeId++}`;

function buildGraph(nodes: Node[], edges: Edge[]): ErGraph {
  const entities = nodes
    .filter((n) => n.type === "entity")
    .map((n) => ({
      name: n.data.label as string,
      isWeak: !!n.data.isWeak,
      attributes: nodes
        .filter((a) => a.type === "attribute")
        .filter((a) =>
          edges.some(
            (e) =>
              (e.source === n.id && e.target === a.id) ||
              (e.target === n.id && e.source === a.id)
          )
        )
        .map((a) => ({
          name: a.data.label as string,
          isKey: !!a.data.isKey,
          isMultivalued: !!a.data.isMultivalued,
          isDerived: !!a.data.isDerived,
        })),
    }));

  const relationships = nodes
    .filter((n) => n.type === "relationship")
    .map((rel) => {
      const connectedEdges = edges.filter(
        (e) => e.source === rel.id || e.target === rel.id
      );
      const participants = connectedEdges
        .map((e) => {
          const entityId = e.source === rel.id ? e.target : e.source;
          const entity = nodes.find((n) => n.id === entityId && n.type === "entity");
          if (!entity) return null;
          return {
            entityName: entity.data.label as string,
            cardinality: (e.label as string) || "N",
            participation: "partial" as const,
          };
        })
        .filter(Boolean) as ErGraph["relationships"][0]["participants"];

      return {
        name: rel.data.label as string,
        isIdentifying: !!rel.data.isIdentifying,
        participants,
      };
    });

  return { entities, relationships };
}

interface ErEditorProps {
  onExport: (graph: ErGraph) => void;
  disabled?: boolean;
}

export default function ErEditor({ onExport, disabled = false }: ErEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [edgeLabel, setEdgeLabel] = useState<"1" | "N" | "M">("N");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            label: edgeLabel,
            markerEnd: { type: MarkerType.Arrow },
            style: { strokeWidth: 2 },
          },
          eds
        )
      ),
    [edgeLabel, setEdges]
  );

  function addNode(type: "entity" | "attribute" | "relationship") {
    const defaults: Record<string, object> = {
      entity: { label: "Ентитет", isWeak: false },
      attribute: { label: "атрибут", isKey: false, isMultivalued: false, isDerived: false },
      relationship: { label: "Врска", isIdentifying: false },
    };
    const positions: Record<string, { x: number; y: number }> = {
      entity: { x: 200, y: 150 },
      attribute: { x: 350, y: 100 },
      relationship: { x: 300, y: 250 },
    };
    const newNode: Node = {
      id: uid(),
      type,
      position: {
        x: positions[type].x + Math.random() * 60 - 30,
        y: positions[type].y + Math.random() * 60 - 30,
      },
      data: defaults[type],
    };
    setNodes((nds) => [...nds, newNode]);
  }

  function updateSelectedLabel(label: string) {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, label } } : n
      )
    );
    setSelectedNode((s) => s ? { ...s, data: { ...s.data, label } } : s);
  }

  function toggleFlag(flag: string) {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, [flag]: !n.data[flag] } }
          : n
      )
    );
    setSelectedNode((s) =>
      s ? { ...s, data: { ...s.data, [flag]: !s.data[flag] } } : s
    );
  }

  function deleteSelected() {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }

  const entityFlags =
    selectedNode?.type === "entity"
      ? [{ key: "isWeak", label: "Слаб ентитет" }]
      : selectedNode?.type === "attribute"
      ? [
          { key: "isKey", label: "Примарен (клуч)" },
          { key: "isMultivalued", label: "Повеќевреден" },
          { key: "isDerived", label: "Изведен" },
        ]
      : selectedNode?.type === "relationship"
      ? [{ key: "isIdentifying", label: "Идентификувачка врска" }]
      : [];

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>Додај</span>
          <button className={`${styles.toolBtn} ${styles.entityBtn}`} onClick={() => addNode("entity")} disabled={disabled}>
            □ Ентитет
          </button>
          <button className={`${styles.toolBtn} ${styles.attrBtn}`} onClick={() => addNode("attribute")} disabled={disabled}>
            ○ Атрибут
          </button>
          <button className={`${styles.toolBtn} ${styles.relBtn}`} onClick={() => addNode("relationship")} disabled={disabled}>
            ◇ Врска
          </button>
        </div>

        <div className={styles.toolGroup}>
          <span className={styles.toolLabel}>Кардиналност на линија</span>
          {CARDINALITIES.map((c) => (
            <button
              key={c}
              className={`${styles.cardBtn} ${edgeLabel === c ? styles.cardActive : ""}`}
              onClick={() => setEdgeLabel(c)}
              disabled={disabled}
            >
              {c}
            </button>
          ))}
        </div>

        {selectedNode && (
          <div className={styles.toolGroup}>
            <span className={styles.toolLabel}>Избрано</span>
            <input
              className={styles.labelInput}
              value={selectedNode.data.label as string}
              onChange={(e) => updateSelectedLabel(e.target.value)}
              disabled={disabled}
            />
            {entityFlags.map((f) => (
              <label key={f.key} className={styles.flagLabel}>
                <input
                  type="checkbox"
                  checked={!!selectedNode.data[f.key]}
                  onChange={() => toggleFlag(f.key)}
                  disabled={disabled}
                />
                {f.label}
              </label>
            ))}
            <button className={styles.deleteBtn} onClick={deleteSelected} disabled={disabled}>
              Избриши
            </button>
          </div>
        )}

        <button
          className={styles.exportBtn}
          onClick={() => onExport(buildGraph(nodes, edges))}
          disabled={disabled || nodes.length === 0}
        >
          Провери →
        </button>
      </div>

      {/* Canvas */}
      <div className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NODE_TYPES}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          deleteKeyCode="Delete"
        >
          <Background gap={16} color="#e2e8f0" />
          <Controls />
          <MiniMap nodeColor={(n) => n.type === "entity" ? "#dbeafe" : n.type === "attribute" ? "#dcfce7" : "#ede9fe"} />
        </ReactFlow>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.entityDot} /> Ентитет (□)</span>
        <span className={styles.legendItem}><span className={styles.attrDot} /> Атрибут (○)</span>
        <span className={styles.legendItem}><span className={styles.relDot} /> Врска (◇)</span>
        <span className={styles.legendNote}>Поврзи со влечење · Кликни за уредување · Delete за бришење</span>
      </div>
    </div>
  );
}
