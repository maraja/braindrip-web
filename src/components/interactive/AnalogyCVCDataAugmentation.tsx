import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDataAugmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a child to recognize dogs by showing them only one photo of a golden retriever taken from the front, in daylight. They would struggle to recognize the same dog from the side, at dusk, or partially hidden behind a fence.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The baseline augmentation toolkit includes:  Random horizontal flip (p=0.5) -- nearly universal for natural images, never for text or medical laterality tasks. Random crop -- e.g., resize to 256 pixels then take a random 224x224 crop. At test time, use a center crop.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a training sample (x, y), augmentation applies a stochastic transformation T drawn from a policy &#123;T&#125; to produce (T(x), y). The model trains on the augmented distribution, which is a smoothed, broader version of the original data manifold.' },
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
