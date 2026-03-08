import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCKnowledgeDistillation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider an experienced chess grandmaster teaching a beginner. Rather than just saying "this move wins, that move loses" (hard labels), the grandmaster explains "this move is strong, that one is decent, and that third option looks tempting but leads to trouble" (soft labels).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Standard softmax produces peaked distributions where the correct class dominates and other classes have negligible probability. To expose the dark knowledge, both teacher and student use a temperature parameter T to soften the distribution:  [equation]  At T = 1, this is the standard softmax.' },
    { emoji: '🔍', label: 'In Detail', text: 'Hinton et al. (2015) called this information "dark knowledge" -- the knowledge hidden in the wrong answers. A teacher that assigns 0.01 probability to "cat" and 0.001 to "car" when the image is a dog is telling the student that dogs look more like cats than cars. This relational structure is invisible in one-hot labels.' },
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
