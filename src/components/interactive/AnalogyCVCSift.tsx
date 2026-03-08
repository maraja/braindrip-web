import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSift() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine recognizing a friend\'s face whether they are close up or far away, tilting their head, or standing in different lighting. Your brain extracts stable identity cues that survive these transformations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Build a Gaussian scale space by convolving the image I with Gaussians of increasing :  [equation]  Compute the Difference of Gaussians (DoG) between consecutive scales:  [equation]  where k = 2^&#123;1/s&#125; and s is the number of scale intervals per octave (typically s = 3).' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by David Lowe in 1999 (journal version 2004), SIFT dominated feature-based vision for over a decade and remains a reference point for descriptor design.' },
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
