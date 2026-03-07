import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLLE05WhereLlmsAreHeading() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏗', label: 'Building', text: 'Think of Where LLMs Are Heading like constructing a building. Imagine standing at the edge of a rapidly advancing frontier. Behind you: a clear history of scaling laws, benchmark improvements, and architectura... Just as a builder follows blueprints to create a structure, this concept provides the foundational framework that everything else builds upon.' },
    { emoji: '🎭', label: 'Theater', text: 'Where LLMs Are Heading is like directing a theater production. Imagine standing at the edge of a rapidly advancing frontier. Behind you: a clear history of scaling laws, benchmark improvements, and architectura... Each element plays a specific role, and the overall performance depends on how well they work together.' },
    { emoji: '🗺', label: 'Navigation', text: 'Think of Where LLMs Are Heading like navigating with a map. Imagine standing at the edge of a rapidly advancing frontier. Behind you: a clear history of scaling laws, benchmark improvements, and architectura... You need to understand where you are, where you want to go, and the best route to get there.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
