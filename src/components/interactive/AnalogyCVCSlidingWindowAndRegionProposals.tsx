import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSlidingWindowAndRegionProposals() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine searching for a lost earring in a room. The sliding window approach checks every single square inch of floor, furniture, and countertop at every possible zoom level -- thorough but painfully slow.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Construct an image pyramid by resizing the input to multiple scales (e.g., 10-20 levels with a factor of ~1.2 between adjacent scales). At each scale, slide a fixed-size window (e.g., 64 x 128 pixels for pedestrians) across the image with a stride s (commonly 4-8 pixels). Extract features from each window (HOG, LBP, or CNN features).' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, a sliding window detector moves a fixed-size window across an image at multiple scales and aspect ratios, running a classifier at each position. Region proposals replace this brute-force search with an algorithm that generates a sparse set of candidate bounding boxes (typically 1,000-2,000) that are likely to contain objects, based on.' },
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
