import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFFeatureExtractionAndTransformation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a real estate dataset with columns for lot length and lot width. A linear model might struggle to learn that area (length times width) drives price. But if you create an explicit "area" feature, the relationship becomes obvious.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For features x_1, x_2, degree-2 polynomial expansion generates:  [equation]  The interaction term x_1 x_2 captures combined effects that neither feature alone reveals. More generally, degree-d expansion of p features produces &#123;p+d&#125;&#123;d&#125; terms, which grows rapidly -- degree 3 with 10 features yields 286 terms.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, given raw features x = (x_1, , x_p), feature extraction applies a mapping : &#123;R&#125;^p  &#123;R&#125;^q to produce a new representation (x) that is more informative for the learning task.' },
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
