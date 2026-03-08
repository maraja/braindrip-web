import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEUserFeedbackAsEvaluationSignal() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a restaurant with two sources of information about food quality. The first is a suggestion box by the door -- a few passionate diners write detailed complaints or praise. The second is the surveillance camera showing how people actually eat: do they finish their plates, do they order dessert, do they come back next week?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Thumbs up/down is the simplest and most widely deployed mechanism. Its advantages are low user friction (one click), high response rates relative to other methods (typically 3-8% of interactions), and easy aggregation.' },
    { emoji: '🔍', label: 'In Detail', text: 'Explicit feedback is what users deliberately tell you about their experience: thumbs up/down buttons, star ratings, free-text comments, or satisfaction surveys. Implicit feedback is what users reveal through their behavior without intending to: abandoning a conversation, rephrasing their question three times, copying the agent\'s output without.' },
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
