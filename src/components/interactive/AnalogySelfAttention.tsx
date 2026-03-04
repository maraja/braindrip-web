import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySelfAttention() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍽', label: 'Dinner Party', text: 'At a dinner party, each guest (token) looks around the table to decide who to pay attention to. When you hear "bank," you glance at "river" or "money" to figure out the meaning. Each word queries every other word, weighing how relevant they are, then updates its own understanding based on who it found most informative.' },
    { emoji: '🔦', label: 'Spotlight', text: 'Self-attention is like each actor on stage having their own spotlight they can aim at any other actor. The word "it" shines its spotlight on "the cat" to resolve what "it" refers to. Every word independently decides where to focus, creating a web of connections that captures meaning.' },
    { emoji: '📖', label: 'Study Group', text: 'In a study group, each student (token) asks: "Who here can help me understand my role?" A student holding the word "cold" looks to "winter," "ice," and "shiver" for context. Each student writes a question (query), offers expertise (value), and advertises what they know (key). Matches form naturally.' },
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
