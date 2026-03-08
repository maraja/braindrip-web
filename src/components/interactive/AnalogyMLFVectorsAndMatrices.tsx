import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFVectorsAndMatrices() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are describing a house to a buyer. You might list its square footage, number of bedrooms, age, and price. Each of these numbers is a feature, and together they form a vector -- an ordered list of numbers that locates the house as a single point in a four-dimensional "feature space.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A vector space over &#123;R&#125; is a set V equipped with vector addition and scalar multiplication satisfying closure, associativity, commutativity, and the existence of additive identity and inverses. The canonical example is &#123;R&#125;^n.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a vector x  &#123;R&#125;^n is an element of an n-dimensional real vector space. A matrix A  &#123;R&#125;^&#123;m x n&#125; is a rectangular array with m rows and n columns. In ML the convention is almost universal: each row of a data matrix X  &#123;R&#125;^&#123;m x n&#125; is one sample and each column is one feature.' },
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
