import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPMultiAgentDecisionFramework() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about hiring employees. If you run a small bakery and you are considering whether to hire five specialized workers -- one to mix dough, one to shape loaves, one to manage the oven, one to handle the register, one to clean -- the answer is probably no.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Before designing a multi-agent system, prove that a single agent cannot meet your requirements. This is the most important step and the one most often skipped. Test protocol:  Build the simplest possible single-agent implementation using your best available model.' },
    { emoji: '🔍', label: 'In Detail', text: 'The same logic applies to multi-agent systems. A single agent with the right tools can handle most tasks. Multi-agent architectures introduce real costs -- coordination overhead, context isolation, communication latency, debugging complexity -- that are only justified when a single agent demonstrably cannot meet the requirements.' },
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
