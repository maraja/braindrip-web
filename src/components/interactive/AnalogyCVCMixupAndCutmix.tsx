import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMixupAndCutmix() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine learning to classify animals by seeing not just pure photos of cats and dogs, but also composite images that are 70% cat and 30% dog, with labels reflecting that blend. This forces you to learn what makes a cat truly cat-like rather than memorizing specific images.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given two training samples (x_i, y_i) and (x_j, y_j), Mixup (Zhang et al., 2018) creates a virtual sample:  [equation] [equation]  where   Beta(, ) and  is a hyperparameter controlling the strength of mixing. Common choices:   = 0.2: mild mixing, most  values near 0 or 1  = 1.0: uniform mixing,  uniform on [0, 1]  = 0.' },
    { emoji: '🔍', label: 'CutMix', text: 'CutMix (Yun et al., 2019) replaces a rectangular region of one image with the corresponding region from another:  [equation] [equation]  where M  \\&#123;0, 1\\&#125;^&#123;W x H&#125; is a binary mask with a rectangular hole, and  is the area ratio of the retained region:  [equation]  The cut region dimensions are sampled as r_w = W&#123;1 - &#125; and r_h = H&#123;1 - &#125;, with the.' },
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
