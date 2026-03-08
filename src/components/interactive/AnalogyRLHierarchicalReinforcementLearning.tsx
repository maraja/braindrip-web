import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLHierarchicalReinforcementLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how you plan a cross-country road trip. You do not decide each individual steering adjustment from the start. Instead, you first plan a route through major cities, then navigate between cities by choosing highways, and finally handle the low-level driving -- lane changes, speed control, turns.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most influential formalization of HRL is the options framework (Sutton, Precup, and Singh, 1999). An option  is a triple (I_, _, _) where:  I_  S is the initiation set (states where the option can start) _(a  s) is the intra-option policy (how the option behaves) _(s)  [0, 1] is the termination condition (probability of stopping in state s)  A.' },
    { emoji: '🔍', label: 'In Detail', text: 'Hierarchical reinforcement learning (HRL) brings this same structure to RL agents. Instead of choosing primitive actions at every timestep, the agent operates through a hierarchy where high-level policies select goals or subtasks, and low-level policies execute the primitive actions needed to achieve them.' },
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
