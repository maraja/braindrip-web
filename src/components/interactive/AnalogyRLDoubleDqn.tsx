import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLDoubleDqn() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are choosing a restaurant. You ask friends for recommendations and always pick the friend whose rating is highest. But some friends are enthusiastic exaggerators -- they rate everything highly. By always picking the maximum rating, you systematically end up at overhyped restaurants.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In standard Q-learning, the TD target is:  [equation]  The  operator does double duty: it both selects the best action () and evaluates it (the Q-value at that action). When Q-values contain noise _a, the expected value of the max is biased upward:  [equation]  This follows from Jensen\'s inequality applied to the convex max function.' },
    { emoji: '🔍', label: 'In Detail', text: 'Standard Q-learning and DQN use a  operator that simultaneously selects the best action and evaluates its value using the same Q-function. When Q-values contain estimation noise (as they inevitably do with function approximation), the max operator preferentially selects overestimated actions, creating a systematic upward bias.' },
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
