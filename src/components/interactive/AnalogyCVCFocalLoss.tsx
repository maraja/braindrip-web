import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFocalLoss() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'In a typical image, a single-stage detector evaluates tens of thousands of anchor locations, but only a handful (perhaps 10-50) contain actual objects. The rest are background. Standard cross-entropy loss treats every example equally, so the overwhelming majority of easy background examples dominate the loss and gradients, drowning out the signal.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a binary classification with probability p of the correct class:  [equation]  where p_t = p if the example is positive, and p_t = 1 - p otherwise. The problem: when a background anchor is classified correctly with p_t = 0.9, the loss is -(0.9)  0.105.' },
    { emoji: '🔍', label: 'In Detail', text: 'Focal loss turns down the volume on those 99,000 easy hummers. Technically, focal loss (Lin et al., 2017) modifies the standard cross-entropy loss with a factor (1 - p_t)^ that smoothly reduces the loss contribution from confidently classified (easy) examples, focusing training on the hard, misclassified examples that matter most.' },
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
