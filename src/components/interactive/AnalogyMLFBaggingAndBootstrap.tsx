import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFBaggingAndBootstrap() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you want to estimate the temperature outside. Instead of trusting a single thermometer that might be miscalibrated, you place ten thermometers around your yard and average their readings. Each thermometer has its own quirks (variance), but averaging them cancels out individual errors, giving you a more stable estimate.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a training set D = \\&#123;(x_1, y_1), , (x_n, y_n)\\&#125;, a bootstrap sample D^&#123;*&#125;_b is formed by drawing n examples uniformly at random with replacement from D. Because sampling is done with replacement, some examples appear multiple times while others are omitted entirely.' },
    { emoji: '🔍', label: 'In Detail', text: 'Bagging -- short for Bootstrap AGGregating -- applies this same logic to machine learning. Introduced by Leo Breiman in 1996, bagging trains multiple instances of a base learner on different random subsets of the training data, then combines their predictions through averaging (regression) or majority voting (classification).' },
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
