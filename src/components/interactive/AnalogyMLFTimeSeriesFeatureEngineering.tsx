import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFTimeSeriesFeatureEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of predicting tomorrow\'s temperature. You would naturally consider today\'s temperature, the trend over the past week, whether it is winter or summer, and whether tomorrow is typically warmer or cooler than today.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most fundamental time-series features are lagged values of the target or covariates:  [equation]  A lag-1 feature gives the model yesterday\'s value; lag-7 gives the value from the same day last week.' },
    { emoji: '🔍', label: 'In Detail', text: 'Time-series feature engineering is the process of transforming a temporally ordered sequence \\&#123;y_1, y_2, , y_T\\&#125; (and possibly associated covariates) into a tabular feature matrix suitable for supervised learning. The key constraint is temporal causality: every feature computed for time t must use only information available before time t.' },
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
