import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyNLPResponsibleNlpDevelopment() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏗', label: 'Building', text: 'Think of Responsible NLP Development like constructing a building. Imagine building a bridge. Engineers do not simply calculate load-bearing capacity and pour concrete. They file environmental impact assessments, f... Just as a builder follows blueprints to create a structure, this concept provides the foundational framework that everything else builds upon.' },
    { emoji: '🎭', label: 'Theater', text: 'Responsible NLP Development is like directing a theater production. Imagine building a bridge. Engineers do not simply calculate load-bearing capacity and pour concrete. They file environmental impact assessments, f... Each element plays a specific role, and the overall performance depends on how well they work together.' },
    { emoji: '🗺', label: 'Navigation', text: 'Think of Responsible NLP Development like navigating with a map. Imagine building a bridge. Engineers do not simply calculate load-bearing capacity and pour concrete. They file environmental impact assessments, f... You need to understand where you are, where you want to go, and the best route to get there.' },
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
