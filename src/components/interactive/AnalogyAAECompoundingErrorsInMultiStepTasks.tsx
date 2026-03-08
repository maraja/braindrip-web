import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAECompoundingErrorsInMultiStepTasks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture a relay race with 10 runners. If each runner has a 95% chance of completing their leg without dropping the baton, the team\'s chance of a clean race is not 95% -- it is 0.95^&#123;10&#125;  60\\%. Each handoff is an independent opportunity for failure, and the failures multiply.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Under the simplifying assumption that each step succeeds independently with probability p, the probability of an n-step task succeeding is:  [equation]  This gives us the following concrete numbers:  The numbers are sobering. Even at 95% per-step reliability -- which sounds excellent -- an agent fails nearly two-thirds of 20-step tasks.' },
    { emoji: '🔍', label: 'In Detail', text: 'AI agents face the same dynamic. Every tool call, every reasoning step, every environment interaction is a potential failure point. An agent that appears highly capable on individual steps can fail frequently on realistic multi-step tasks.' },
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
