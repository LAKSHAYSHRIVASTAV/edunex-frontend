import React from "react";


const TYPE_LABELS = {
  core: 'Core Concept',
  input: 'Input',
  output: 'Output',
  process: 'Process',
  byproduct: 'Byproduct',
  concept: 'Concept',
};

const TYPE_COLORS = {
  core:      { bg: '#EDE9FF', text: '#5B4EE8', border: '#C4B9FF' },
  input:     { bg: '#D1FAE5', text: '#1D9E75', border: '#6EE7B7' },
  output:    { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
  process:   { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
  byproduct: { bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4' },
  concept:   { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' },
};

export default function NodeDetailPanel({ node, mapData, onClose }) {
  if (!node) return null;

  const colors = TYPE_COLORS[node.type] || TYPE_COLORS.concept;

  // Find connected nodes
  const connectedEdges = mapData?.edges?.filter(
    (e) => e.source === node.id || e.target === node.id
  ) || [];

  const connectedNodes = connectedEdges.map((e) => {
    const otherId = e.source === node.id ? e.target : e.source;
    const other = mapData?.nodes?.find((n) => n.id === otherId);
    return { node: other, edge: e, direction: e.source === node.id ? 'out' : 'in' };
  }).filter((c) => c.node);

  return (
    <div className="node-detail">
      <div className="node-detail__header">
        <div
          className="node-detail__badge"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {TYPE_LABELS[node.type] || 'Concept'}
        </div>
        <button className="node-detail__close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <h3 className="node-detail__name">{node.label}</h3>

      {node.description && (
        <p className="node-detail__desc">{node.description}</p>
      )}

      {connectedNodes.length > 0 && (
        <div className="node-detail__connections">
          <p className="connections-label">Connections ({connectedNodes.length})</p>
          <div className="connections-list">
            {connectedNodes.map(({ node: other, edge, direction }, i) => {
              const c = TYPE_COLORS[other.type] || TYPE_COLORS.concept;
              return (
                <div key={i} className="connection-item">
                  <div className="connection-arrow" style={{ color: direction === 'out' ? '#5B4EE8' : '#1D9E75' }}>
                    {direction === 'out' ? '→' : '←'}
                  </div>
                  <div className="connection-info">
                    <span className="connection-rel">{edge.label || 'related to'}</span>
                    <span
                      className="connection-node"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {other.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
