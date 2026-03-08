import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLTemporalDifferenceLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are driving to a new restaurant and estimating your arrival time. With a Monte Carlo approach, you would wait until you arrive to assess your estimate. But with a temporal difference (TD) approach, you revise your estimate at every intersection based on what you can see from here.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest TD method, TD(0), updates the value of a state immediately after observing the next reward and next state:  [equation]  The key quantity is the TD error (or TD residual):  [equation]  This measures the discrepancy between the current estimate V(S_t) and the TD target R_&#123;t+1&#125; +  V(S_&#123;t+1&#125;).' },
    { emoji: '🔍', label: 'In Detail', text: 'TD learning is the most central and distinctive idea in reinforcement learning. It combines two powerful principles: sampling from experience (like Monte Carlo methods, requiring no model) and bootstrapping (like dynamic programming, updating estimates based on other estimates).' },
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
