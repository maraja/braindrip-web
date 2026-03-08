import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLAdvantageEstimation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a basketball player deciding whether to shoot a three-pointer or pass. The raw outcome (winning or losing the game) is too noisy to learn from -- hundreds of other decisions also affected the result. What matters is: "Was shooting better than what I would typically do in that situation?" If the expected value of being in that position is 0.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Policy gradients weight the score function _  _(a|s) by some estimate of how good the action was. Using raw returns G_t (as in REINFORCE) injects enormous variance because G_t includes rewards from the distant future that have nothing to do with action a_t.' },
    { emoji: '🔍', label: 'In Detail', text: 'The advantage function captures this precisely:' },
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
