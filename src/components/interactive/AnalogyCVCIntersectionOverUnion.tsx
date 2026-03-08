import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCIntersectionOverUnion() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Picture two rectangles of transparent colored film laid on a table -- one red (your prediction) and one blue (the ground truth). Where they overlap, you see purple. IoU asks: what fraction of the total colored area is purple? If the rectangles are perfectly aligned, the answer is 1.0 (100% overlap). If they do not touch at all, the answer is 0.0.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given two boxes defined by their corners: Box A: (x_1^A, y_1^A, x_2^A, y_2^A) Box B: (x_1^B, y_1^B, x_2^B, y_2^B)  Step 1: Compute intersection coordinates: [equation] [equation]  Step 2: Compute intersection area: [equation]  Step 3: Compute union area: [equation]  Step 4: Compute IoU: [equation]' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, Intersection over Union (also called the Jaccard index for sets) is defined as:' },
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
