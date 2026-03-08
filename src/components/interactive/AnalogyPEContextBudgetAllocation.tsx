import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEContextBudgetAllocation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine packing a suitcase with a strict weight limit. You need clothes, toiletries, electronics, documents, and maybe a book. Each category gets a share of the weight budget based on trip requirements — a business trip allocates more to formal wear; a beach vacation allocates more to casual clothes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A typical context budget divides the window into five zones:  System Prompt Zone (10-20% of window): Contains persistent instructions, persona definitions, tool descriptions, output format specifications, and safety guidelines. This zone is stable across turns — its content rarely changes during a conversation.' },
    { emoji: '🔍', label: 'In Detail', text: 'Context budget allocation applies this same thinking to the LLM context window. The window has a fixed token capacity, and every component — system instructions, conversation turns, retrieved documents, tool outputs — competes for that capacity.' },
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
