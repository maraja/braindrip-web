import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCPointnet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a bag of Scrabble tiles -- the order you pull them out does not change which letters you have. A point cloud is similar: it is a set of 3D points with no inherent ordering, and any network processing it must produce the same output regardless of how the points are arranged. PointNet (Qi et al.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given n input points, each represented as (x, y, z) (optionally with normals or color), PointNet processes them as follows:  Input Transform (T-Net): A mini-network predicts a 3 x 3 transformation matrix to align the input point cloud to a canonical orientation. This is learned end-to-end and acts as a spatial transformer.' },
    { emoji: '🔍', label: 'Why Max-Pool Works', text: 'The authors prove that PointNet approximates any continuous symmetric function on point sets. The max-pool identifies a "critical point set" -- a sparse subset of points (often 50--100 out of 1024) that fully determines the global shape descriptor.' },
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
