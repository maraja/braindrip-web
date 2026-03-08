import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFEncodingCategoricalVariables() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a computer to understand the concept of "color." A human intuitively knows that red, blue, and green are distinct categories with no inherent ordering. But machine learning algorithms operate on numbers -- they compute distances, gradients, and dot products.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Label encoding assigns each category an integer: (c_i) = i. If colors are \\&#123;red, green, blue\\&#125;, the encoding might be red  0, green  1, blue  2. When appropriate: Only for genuinely ordinal data where the integer assignment reflects a meaningful order.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a categorical feature X taking values in a set &#123;C&#125; = \\&#123;c_1, c_2, , c_k\\&#125; with cardinality k = , an encoding is a function : &#123;C&#125;  &#123;R&#125;^d that maps each category to a d-dimensional numerical vector. The critical design choice is what structure  introduces -- or avoids introducing.' },
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
