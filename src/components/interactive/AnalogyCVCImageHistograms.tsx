import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageHistograms() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine pouring a bag of M&Ms onto a table and sorting them by color into separate piles. The height of each pile tells you how many candies of that color you have. An image histogram does the same thing with pixel intensities: it sorts every pixel into bins based on its brightness (or color channel value) and counts how many pixels fall into each.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For an 8-bit image (L = 256), histogram computation is a single pass through all pixels, incrementing a 256-element counter array. The time complexity is O(M x N), and it requires only O(L) additional memory.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, for a grayscale image I with intensity levels \\&#123;0, 1, , L-1\\&#125;, the histogram h(k) is:' },
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
