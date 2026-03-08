import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACToolSelectionAndRouting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a skilled craftsperson standing in front of a large workbench with dozens of tools. When asked to join two pieces of wood, they instinctively reach for the right tool — wood glue for a permanent bond, clamps for holding, a drill for screws.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The tool description is the single most important factor in selection accuracy. The LLM reads the name, description, and parameter schema to decide relevance. Effective descriptions follow specific patterns: they state what the tool does (not how), when to use it, and when NOT to use it.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tool selection is the decision-making layer between understanding intent and executing action. When an LLM receives a user request alongside a set of tool definitions (name, description, parameters), it must determine: (1) Does this request require a tool at all, or can it be answered directly? (2) If a tool is needed, which one?' },
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
