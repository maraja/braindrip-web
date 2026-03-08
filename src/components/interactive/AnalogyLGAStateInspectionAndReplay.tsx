import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAStateInspectionAndReplay() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a security camera system that records every room in a building. At any moment you can check the live feed (current state), rewind the tape to see what happened at 2:47 PM (state history), or start a new recording branch from any point in the past (replay). That is exactly what LangGraph provides when you use a checkpointer.' },
    { emoji: '⚙️', label: 'How It Works', text: 'get_state() returns the current state of a thread along with metadata about what would execute next:' },
    { emoji: '🔍', label: 'In Detail', text: 'Every time a node executes, the checkpointer saves a snapshot of the entire graph state. These snapshots form a timeline that you can inspect, search, and branch from. This is not just logging -- you can actually resume execution from any historical checkpoint, making it possible to debug issues, test alternative paths, and recover from errors by.' },
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
