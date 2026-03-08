import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLMonteCarloMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine learning to cook without a recipe book. You try a dish, taste the final result, and adjust. If the meal was great, you remember what you did; if it was terrible, you try something different next time. Crucially, you judge each cooking session only by the finished dish -- you don\'t evaluate individual steps mid-preparation.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core idea: V^(s) = &#123;E&#125;_[G_t  S_t = s], so we estimate this expectation by averaging observed returns from state s. First-Visit MC: For each episode, only the first time state s is visited contributes a return sample.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike dynamic programming, MC methods require no model of the environment. They learn directly from experience -- sequences of states, actions, and rewards gathered by interacting with the environment. The only requirement is that episodes eventually terminate, so that we can compute a finite return for each visited state.' },
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
