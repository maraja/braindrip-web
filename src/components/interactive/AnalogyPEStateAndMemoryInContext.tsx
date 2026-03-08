import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEStateAndMemoryInContext() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the difference between sticky notes on your desk and a notebook. Sticky notes are quick-access, always-visible reminders — "client budget: $50K," "deadline: March 15," "prefers email over phone." The notebook holds your detailed working notes — calculations in progress, evolving drafts, and step-by-step reasoning.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A scratchpad is a designated section of the context where the model can write intermediate reasoning, partial results, and work-in-progress computations. Unlike chain-of-thought (which happens within a single response), a scratchpad persists across turns, allowing multi-turn reasoning processes.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs are fundamentally stateless — each inference call starts fresh with no memory of previous calls. Any sense of "memory" or "state" is an illusion created by including relevant information in the context window. Every fact the model "remembers" is actually present in the prompt text.' },
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
