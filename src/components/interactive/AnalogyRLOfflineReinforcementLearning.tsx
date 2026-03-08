import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLOfflineReinforcementLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you inherit a retired doctor\'s complete case files -- thousands of patients, treatments administered, outcomes recorded. You want to learn the best treatment policy, but you cannot run new experiments on patients. You must learn entirely from the historical data, warts and all.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The agent is given a static dataset &#123;D&#125; = \\&#123;(s_i, a_i, r_i, s_i\')\\&#125;_&#123;i=1&#125;^N collected by some unknown behavior policy _. The goal is to learn a policy  that maximizes:  [equation]  using only &#123;D&#125;, with no environment interaction.' },
    { emoji: '🔍', label: 'In Detail', text: 'Also called batch RL, offline RL operates under a constraint that is natural in most real-world settings. Hospitals cannot run arbitrary treatment experiments. Self-driving cars cannot crash to learn. Dialogue systems cannot antagonize real users.' },
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
