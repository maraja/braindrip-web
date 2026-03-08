import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACHierarchicalAgentSystems() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of how a large construction project is managed. The project owner communicates their vision to a general contractor. The general contractor decomposes the project into trades — plumbing, electrical, framing, finishing — and hires subcontractors for each. Each subcontractor manages a crew of workers who do the actual physical work.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical three-level hierarchy:  Level 0 — Orchestrator/CEO: Receives the original task from the user. Responsibilities: understand the goal, create a high-level plan, assign major workstreams to Level 1 agents, monitor progress, synthesize final output. Uses a powerful model capable of strategic reasoning.' },
    { emoji: '🔍', label: 'In Detail', text: 'Hierarchical agent systems replicate this organizational structure with AI agents. A top-level agent (CEO/orchestrator) receives a complex goal and decomposes it into major workstreams. Each workstream is assigned to a mid-level agent (manager) that further decomposes its workstream into concrete tasks.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
