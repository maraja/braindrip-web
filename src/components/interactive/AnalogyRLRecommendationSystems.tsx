import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRecommendationSystems() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a librarian who recommends books. A naive librarian suggests whatever is most likely to be checked out today (the supervised learning approach -- maximize immediate click-through). A wise librarian thinks further ahead: "If I recommend this challenging book now, the reader will develop broader tastes, leading to deeper engagement for years.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The recommendation problem maps naturally to an MDP:  State: User\'s interaction history, profile, context (time, device, session features) Actions: Items to recommend (or a ranked list/slate of items) Reward: User engagement signals (clicks, dwell time, purchases, ratings, return visits) Transition: User state evolves based on their interaction.' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional recommenders optimize for immediate metrics -- click-through rate, purchase probability, or rating prediction. But user engagement is a sequential process: today\'s recommendation shapes tomorrow\'s preferences. Recommending only popular items creates a filter bubble. Recommending only high-confidence items never surfaces new interests.' },
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
