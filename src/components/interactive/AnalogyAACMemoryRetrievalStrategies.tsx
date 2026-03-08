import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACMemoryRetrievalStrategies() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a librarian helping a researcher. The researcher asks about "recent advances in CRISPR gene editing for sickle cell disease." The librarian does not randomly pull books off shelves.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest retrieval signal: prefer memories from the recent past. Exponential decay: Each memory\'s recency score decays exponentially with time:  Step function: Memories within a time window (e.g., last 7 days) get full score; older memories get zero. Simpler but creates an arbitrary cliff.' },
    { emoji: '🔍', label: 'In Detail', text: 'Memory retrieval for agents is this same challenge: given a vast store of memories (past conversations, facts, experiences, documents), how does the agent find the specific items that will be most useful for the current task? The store might contain thousands to millions of entries. Retrieving too many floods the context window.' },
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
