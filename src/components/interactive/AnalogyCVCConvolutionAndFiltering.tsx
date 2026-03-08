import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCConvolutionAndFiltering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine holding a small magnifying glass over a page of text and sliding it across. At each position, the magnifying glass integrates what it sees into a single impression -- emphasizing some parts, ignoring others, depending on the lens shape.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Gaussian kernel approximates a 2D bell curve:  [equation]  It is the only kernel that is both rotationally symmetric and separable: a 2D Gaussian convolution can be decomposed into two 1D passes (horizontal then vertical), reducing complexity from O(N  k^2) to O(N  2k) where k is the kernel width and N is the pixel count.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the 2D discrete convolution of image I with kernel K of size (2a+1) x (2b+1) is:' },
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
