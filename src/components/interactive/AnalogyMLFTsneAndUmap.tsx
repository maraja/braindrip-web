import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFTsneAndUmap() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a social network graph with thousands of people and want to draw it on a whiteboard so that friends appear close together. A simple linear projection (like PCA) would collapse the rich community structure into a blob. What you need is a method that can warp and bend the space to preserve who is near whom.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Step 1: Pairwise similarities in high-D. For each pair of points x_i, x_j, define a conditional probability reflecting how likely x_j is a neighbor of x_i under a Gaussian centered at x_i:  [equation]  Symmetrize: p_&#123;ij&#125; = &#123;p_&#123;jj&#125;&#125;&#123;2n&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'Both methods are nonlinear dimensionality reduction techniques designed primarily for visualization. They excel at revealing clusters, sub-populations, and manifold structure that linear methods miss entirely.' },
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
