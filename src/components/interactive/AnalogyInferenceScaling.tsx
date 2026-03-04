import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyInferenceScaling() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📈', label: 'Overtime Pay', text: 'Training scaling laws say: more data + bigger model = predictably better. Inference scaling laws add a new axis: more thinking time = better answers, with predictable returns. Like overtime at work — more hours yield more output, but with diminishing returns. The key discovery: for many tasks, spending 10x more compute at inference (via search, verification, chain-of-thought) can be more cost-effective than training a 10x larger model.' },
    { emoji: '🔍', label: 'Search Budget', text: 'A detective with 1 hour will do a quick scan. With 10 hours, they\'ll investigate leads, cross-reference clues, and verify alibis. Inference scaling laws quantify this relationship: how does performance improve as you allocate more compute during inference? Models like o1 and R1 demonstrate that scaling test-time compute through extended reasoning chains yields smooth, predictable improvements on math and coding tasks.' },
    { emoji: '🏋️', label: 'Practice vs Talent', text: 'Training scaling is like natural talent — a bigger brain. Inference scaling is like practice and effort on game day. Research shows these complement each other: a moderately talented player (smaller model) who practices intensely (uses more inference compute) can beat a naturally gifted player (larger model) who doesn\'t try as hard. This opens a new dimension for scaling AI capabilities beyond just bigger models.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
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
