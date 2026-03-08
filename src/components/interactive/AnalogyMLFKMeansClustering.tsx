import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFKMeansClustering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you dump a bag of mixed coins onto a table and want to sort them into piles. You start by placing K cups at random positions, then push each coin toward its nearest cup. After every coin is assigned, you move each cup to the center of its pile. Repeat until nothing changes. That is K-means.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The standard K-means procedure, known as Lloyd\'s algorithm, alternates two steps:  Assignment step: Assign each point to the cluster whose centroid is nearest: [equation]  Update step: Recompute centroids as the mean of assigned points: [equation]  These steps repeat until assignments stabilize.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, K-means seeks to partition n observations \\&#123;x_1, , x_n\\&#125; into K disjoint clusters C_1, , C_K by minimizing the within-cluster sum of squares (WCSS):' },
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
