import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVisionTransformerScaling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two runners: one is a natural sprinter who starts fast but plateaus, and the other is a marathoner who starts slow but keeps improving. CNNs are the sprinter -- strong performance with modest data, but diminishing returns at scale.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2022) systematically varied model size and training data to establish scaling behavior. The key finding:  [equation]  where C is the total training compute (FLOPs) and  is a power-law exponent. For ViTs,   0.07 -- meaning that each doubling of compute reduces error by approximately 5%.' },
    { emoji: '🔍', label: 'In Detail', text: 'The study of scaling laws for vision Transformers was catalyzed by Dosovitskiy et al. (2020), who showed ViT underperforms CNNs on ImageNet-1K but dominates with JFT-300M pre-training. Subsequent work by Zhai et al.' },
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
