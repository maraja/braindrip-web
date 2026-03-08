import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGACheckpointers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a checkpointer as an automatic save system in a video game. Every time you complete a level (a node in your graph), the game saves your progress. If you quit and come back later, you pick up exactly where you left off. If you make a mistake, you can reload a previous save and try a different path.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LangGraph provides three checkpointer backends for different stages of development:' },
    { emoji: '🔍', label: 'In Detail', text: 'In LangGraph, a checkpointer automatically snapshots the entire graph state after every node execution. This single mechanism unlocks five powerful capabilities: persistence between sessions (your agent remembers past conversations), human-in-the-loop (pause execution, get human input, resume), memory across conversations (the agent accumulates.' },
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
