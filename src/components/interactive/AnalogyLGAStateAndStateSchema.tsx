import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAStateAndStateSchema() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a hospital chart that follows a patient from admission through triage, diagnosis, and treatment. Every specialist reads the same chart, adds their notes, and passes it along. No specialist erases what came before — they append. The chart is the single source of truth about the patient\'s journey.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When a node returns &#123;"answer": "42"&#125;, the answer field is overwritten. All other fields remain unchanged.' },
    { emoji: '🔍', label: 'In Detail', text: 'In LangGraph, state is that chart. It is a Python TypedDict (or Pydantic model, or dataclass) that every node receives as input and updates as output. Nodes never see each other directly — they communicate exclusively through state. This design makes the graph modular, testable, and easy to reason about.' },
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
