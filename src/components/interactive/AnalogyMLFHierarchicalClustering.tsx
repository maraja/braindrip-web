import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFHierarchicalClustering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine organizing a library without predefined categories. You could start by grouping the two most similar books together, then merging the next most similar pair or group, continuing until everything is in one collection. At any point, you can slice the hierarchy at a chosen level to get a flat clustering.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The standard algorithm proceeds as follows:  Start with n clusters, each containing a single point. Compute the distance between every pair of clusters. Merge the two closest clusters into one.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike K-means, which demands you specify K upfront, hierarchical clustering produces a complete hierarchy of partitions -- from n singleton clusters to a single all-encompassing cluster. The result is a tree structure called a dendrogram that encodes relationships at every granularity.' },
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
