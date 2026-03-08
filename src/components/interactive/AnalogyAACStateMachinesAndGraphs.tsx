import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACStateMachinesAndGraphs() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a vending machine. It has a fixed set of states: idle, accepting coins, selecting product, dispensing. From each state, only certain transitions are possible -- you cannot dispense before selecting, you cannot select before paying.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A finite state machine (FSM) consists of states, transitions, and an initial state. For an agent, states might include "planning," "executing_tool," "waiting_for_human," "synthesizing_result," and "done.' },
    { emoji: '🔍', label: 'In Detail', text: 'A directed graph generalizes this idea. Nodes represent states or actions (call the LLM, invoke a tool, check a condition), and edges represent transitions that may be conditional. Unlike a pure finite state machine, a graph-based agent can have dynamic routing where the LLM decides which edge to follow.' },
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
