import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACToolChaining() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a detective solves a case. They start by interviewing a witness (step 1), which gives them a name. They search that name in a database (step 2), which reveals an address. They visit that address and collect evidence (step 3), which they send to the lab.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest chain is linear: Tool A produces output X, which is passed as input to Tool B, producing output Y, passed to Tool C. The agent plans this chain (sometimes explicitly, sometimes implicitly through step-by-step reasoning) and executes it sequentially.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tool chaining is what elevates an agent from performing single actions to completing real workflows. A user asks "Find all customers who signed up last month and send them a welcome email.' },
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
