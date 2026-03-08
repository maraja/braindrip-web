import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAInterruptAndResume() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a factory assembly line with a big red "PAUSE" button at a quality-check station. When the product reaches that station, the line stops, a light flashes showing what needs inspection, and a human operator examines the item. Only after the operator presses "CONTINUE" -- possibly with an adjustment note -- does the line start moving again.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Two things must be in place before interrupt() will work:  The graph must be compiled with a checkpointer (e.g., MemorySaver, PostgresSaver). Every invocation must include a thread_id in the config so the checkpointer knows which conversation to suspend and resume.' },
    { emoji: '🔍', label: 'In Detail', text: 'In LangGraph, interrupt() is a built-in primitive that halts graph execution mid-node, packages an arbitrary payload for the human caller, and suspends the graph\'s state to a checkpointer. The graph stays frozen at that exact point -- no data is lost, no node re-executes.' },
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
