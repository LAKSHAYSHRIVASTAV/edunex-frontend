import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const NODE_RADIUS = 42;
const FONT_SIZE = 12;

const TYPE_COLORS = {
  core:      { fill: '#EDE9FF', stroke: '#5B4EE8', text: '#3730A3' },
  input:     { fill: '#D1FAE5', stroke: '#1D9E75', text: '#065F46' },
  output:    { fill: '#FEF3C7', stroke: '#EF9F27', text: '#92400E' },
  process:   { fill: '#DBEAFE', stroke: '#3B8BD4', text: '#1E3A8A' },
  byproduct: { fill: '#FCE7F3', stroke: '#D4537E', text: '#831843' },
  concept:   { fill: '#F3F4F6', stroke: '#888780', text: '#374151' },
};

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach((w) => {
    const test = current ? `${current} ${w}` : w;
    if (test.length * (FONT_SIZE * 0.6) > maxWidth - 12) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

export default function ConceptMapCanvas({ mapData, onNodeClick, selectedNodeId }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  const buildGraph = useCallback(() => {
    if (!mapData || !svgRef.current) return;

    const container = svgRef.current.parentElement;
    const W = container.clientWidth || 900;
    const H = container.clientHeight || 560;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', W)
      .attr('height', H);

    // Arrow markers
    const defs = svg.append('defs');
    Object.entries(TYPE_COLORS).forEach(([type, c]) => {
      defs
        .append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', NODE_RADIUS + 10)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M2 1L8 5L2 9')
        .attr('fill', 'none')
        .attr('stroke', c.stroke)
        .attr('stroke-width', 1.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round');
    });

    // Zoom/pan
    const g = svg.append('g');
    svg.call(
      d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', (e) => g.attr('transform', e.transform))
    );

    const nodes = mapData.nodes.map((n) => ({
      ...n,
      x: n.position?.x ?? W / 2,
      y: n.position?.y ?? H / 2,
    }));

    const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const links = mapData.edges
      .map((e) => ({ ...e, source: nodeById[e.source], target: nodeById[e.target] }))
      .filter((e) => e.source && e.target);

    // Simulation
    if (simRef.current) simRef.current.stop();
    simRef.current = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(180).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(NODE_RADIUS + 20));

    // Edges
    const edgeGroup = g.append('g').attr('class', 'edges');
    const linkLines = edgeGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => {
        const targetNode = nodes.find((n) => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
        return TYPE_COLORS[targetNode?.type]?.stroke || '#aaa';
      })
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', (d) => (d.type === 'dashed' ? '6 4' : null))
      .attr('marker-end', (d) => {
        const t = nodes.find((n) => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
        return `url(#arrow-${t?.type || 'concept'})`;
      });

    // Edge labels
    const edgeLabelGroup = g.append('g').attr('class', 'edge-labels');
    const edgeLabels = edgeLabelGroup
      .selectAll('text')
      .data(links.filter((l) => l.label))
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#6B7280')
      .attr('font-family', 'DM Sans, sans-serif')
      .attr('pointer-events', 'none')
      .text((d) => d.label);

    // Node groups
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeGs = nodeGroup
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag()
          .on('start', (e, d) => { if (!e.active) simRef.current.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end', (e, d) => { if (!e.active) simRef.current.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on('click', (e, d) => { e.stopPropagation(); onNodeClick && onNodeClick(d); });

    // Node circles
    nodeGs
      .append('circle')
      .attr('r', (d) => (d.type === 'core' ? NODE_RADIUS + 8 : NODE_RADIUS))
      .attr('fill', (d) => TYPE_COLORS[d.type]?.fill || '#F3F4F6')
      .attr('stroke', (d) => TYPE_COLORS[d.type]?.stroke || '#888')
      .attr('stroke-width', (d) => (d.type === 'core' ? 2.5 : 1.5))
      .attr('class', 'node-circle')
      .style('filter', (d) => (d.type === 'core' ? 'drop-shadow(0 2px 8px rgba(91,78,232,0.25))' : 'none'));

    // Node labels (wrapped)
    nodeGs.each(function (d) {
      const g = d3.select(this);
      const r = d.type === 'core' ? NODE_RADIUS + 8 : NODE_RADIUS;
      const lines = wrapText(d.label, r * 2);
      const lineH = FONT_SIZE + 3;
      const totalH = lines.length * lineH;
      const startY = -totalH / 2 + lineH / 2;

      lines.forEach((line, i) => {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', startY + i * lineH)
          .attr('font-size', d.type === 'core' ? FONT_SIZE + 1 : FONT_SIZE)
          .attr('font-weight', d.type === 'core' ? '600' : '500')
          .attr('fill', TYPE_COLORS[d.type]?.text || '#374151')
          .attr('font-family', 'DM Sans, sans-serif')
          .attr('pointer-events', 'none')
          .text(line);
      });
    });

    // Selected ring
    nodeGs
      .append('circle')
      .attr('r', (d) => (d.type === 'core' ? NODE_RADIUS + 14 : NODE_RADIUS + 6))
      .attr('fill', 'none')
      .attr('stroke', (d) => TYPE_COLORS[d.type]?.stroke || '#888')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', (d) => (d.id === selectedNodeId ? 1 : 0))
      .attr('class', 'selected-ring');

    // Simulation tick
    simRef.current.on('tick', () => {
      linkLines
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      edgeLabels
        .attr('x', (d) => (d.source.x + d.target.x) / 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2 - 6);

      nodeGs.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Click on canvas to deselect
    svg.on('click', () => onNodeClick && onNodeClick(null));

    return () => { if (simRef.current) simRef.current.stop(); };
  }, [mapData, selectedNodeId, onNodeClick]);

  useEffect(() => {
    buildGraph();
    const handleResize = () => buildGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGraph]);

  // Update selected rings without full rebuild
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current)
      .selectAll('.selected-ring')
      .attr('opacity', (d) => (d.id === selectedNodeId ? 1 : 0));
  }, [selectedNodeId]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
