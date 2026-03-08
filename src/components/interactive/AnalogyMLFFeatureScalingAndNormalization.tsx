import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFFeatureScalingAndNormalization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two runners competing in a triathlon. One segment is measured in kilometers, another in seconds, and a third in calories burned. If you simply added the raw numbers to compute a total score, the segment measured in seconds (values in the thousands) would dominate the one measured in kilometers (values in the tens).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Standardization centers each feature at zero mean and unit variance:  [equation]  where  = &#123;1&#125;&#123;n&#125;_&#123;i=1&#125;^n x_i is the sample mean and  = &#123;&#123;1&#125;&#123;n-1&#125;_&#123;i=1&#125;^n (x_i - )^2&#125; is the sample standard deviation. After transformation, x\' has mean  0 and standard deviation  1. When to use: The default choice for most algorithms.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, feature scaling applies a transformation : &#123;R&#125;  &#123;R&#125; to each feature column so that the transformed values occupy a comparable range or distribution. The choice of  depends on the data\'s distribution, the presence of outliers, and the requirements of the downstream algorithm.' },
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
