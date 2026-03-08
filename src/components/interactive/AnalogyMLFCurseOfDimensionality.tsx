import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFCurseOfDimensionality() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you live on a street (1D) and want to visit every house within one block -- easy, maybe 10 houses. Now imagine a city grid (2D): within one block in each direction, you might visit 100 houses. In a 3D building complex, perhaps 1,000. Each new dimension multiplies the space you must cover.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Consider a hypercube [0, 1]^d. To cover this space such that each small region contains at least one data point, we need to divide each dimension into m bins. The total number of bins is m^d.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, many phenomena that are manageable in low dimensions become intractable in high dimensions. Distances concentrate, volumes shift to corners and shells, and the amount of data required to maintain a given density grows exponentially with d.' },
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
