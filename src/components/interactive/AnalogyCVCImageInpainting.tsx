import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageInpainting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a Renaissance painting restorer carefully filling in a damaged section of a fresco, matching the surrounding style, color, and perspective so seamlessly that no one can tell it was ever damaged.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given an image I and a binary mask M (1 where pixels are missing), inpainting produces a completed image &#123;I&#125; such that: &#123;I&#125;  (1 - M) = I  (1 - M) (known pixels are preserved) &#123;I&#125;  M looks natural and consistent with the surrounding context' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional methods propagated texture from boundaries inward. Deep learning methods learn semantic priors from large datasets, enabling them to synthesize complex structures -- generating a missing eye, completing a building facade, or removing an unwanted object.' },
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
