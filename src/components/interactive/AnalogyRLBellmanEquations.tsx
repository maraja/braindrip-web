import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLBellmanEquations() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine planning a cross-country road trip. You don\'t need to evaluate the entire route at once. Instead, you reason: "The value of being in Denver equals the pleasure of driving the next leg to Salt Lake City, plus the value of being in Salt Lake City." You decompose a global evaluation into a local step plus the value of where you end up.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Starting from the definition of the state-value function and using the recursive structure of the return (G_t = R_&#123;t+1&#125; +  G_&#123;t+1&#125;):  [equation]  Expanding the expectation over actions and next states:  [equation]  This says: the value of state s under policy  equals the expected immediate reward plus the discounted value of the next state,.' },
    { emoji: '🔍', label: 'In Detail', text: 'Named after Richard Bellman (1957), these equations are the mathematical backbone of nearly every RL algorithm. They convert the problem of evaluating an infinite sum of future rewards into a system of simultaneous equations, one for each state.' },
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
