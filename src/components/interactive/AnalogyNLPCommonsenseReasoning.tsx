import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPCommonsenseReasoning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the sentence "He put the trophy in the suitcase because it was small." What does "it" refer to -- the trophy or the suitcase? Humans resolve this instantly: the trophy was small (so it fit in the suitcase). Now change one word: "He put the trophy in the suitcase because it was large.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Physical/Naive Physics Commonsense: Understanding of the physical world -- gravity, object permanence, material properties, spatial relationships. "You cannot fit an elephant in a car." "Ice cream melts in the sun." "A glass dropped on concrete will break.' },
    { emoji: '🔍', label: 'In Detail', text: 'Commonsense knowledge is the vast body of background information that humans acquire through everyday experience and never bother to state explicitly. We know that water is wet, that people eat when hungry, that dropped objects fall, that insults cause anger, and that dead people do not attend meetings.' },
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
