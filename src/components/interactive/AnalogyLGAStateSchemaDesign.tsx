import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAStateSchemaDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a state schema as the blueprint for a warehouse. A well-designed warehouse has labeled sections, standardized shelving, and clear pathways -- anyone can find anything quickly. A poorly designed warehouse is a pile of boxes where finding one item means digging through everything.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Start with MessagesState for simple conversational agents, or define your own for more control:' },
    { emoji: '🔍', label: 'In Detail', text: 'In LangGraph, the state schema is a TypedDict (or Pydantic model) that defines every piece of data your agent tracks. Since checkpointers save and restore the entire state, and every node reads from and writes to it, the schema is the single most important design decision in your agent architecture.' },
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
