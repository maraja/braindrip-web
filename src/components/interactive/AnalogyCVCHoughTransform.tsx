import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCHoughTransform() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are in a room full of people and you want to find who is singing the same note. You ask everyone to call out their note, and you listen for the pitch that gets the most voices.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A line in Cartesian coordinates y = mx + b has an unbounded slope parameter. The normal (Hesse) parameterization avoids this:  [equation]  where  is the perpendicular distance from the origin to the line and  is the angle of the perpendicular. Both parameters are bounded:   [0, ) and   [-d, d] where d is the image diagonal.' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by Paul Hough in 1962 (patented for particle track detection) and generalized by Duda and Hart (1972), the Hough transform converts the difficult problem of global shape detection into a simpler peak-finding problem in a parameter accumulator array.' },
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
