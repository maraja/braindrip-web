import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationPipelineArchitecture() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an automobile assembly line. Raw materials enter one end, and finished cars emerge from the other. Between those endpoints, a precisely orchestrated sequence of stations performs specific operations: chassis welding, paint application, engine installation, quality inspection.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Task Loader: Reads task definitions from a task suite or benchmark. Handles task filtering (run only coding tasks, only safety tasks), sampling (run a random 10% for quick checks), and versioning (ensure the task set has not changed between evaluation runs).' },
    { emoji: '🔍', label: 'In Detail', text: 'An evaluation pipeline is the assembly line for agent assessment. Tasks enter one end, and scored evaluation results emerge from the other. Between those endpoints, a sequence of components handles environment setup, agent execution, output collection, scoring by one or more evaluation methods, result aggregation, and report generation.' },
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
