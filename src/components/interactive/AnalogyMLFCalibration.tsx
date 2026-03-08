import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFCalibration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a weather forecaster who says "70% chance of rain" on 100 different days. If it actually rains on 70 of those days, the forecaster is well-calibrated. If it rains on only 40 of those days, the forecaster is overconfident -- the stated probabilities do not match observed frequencies.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A model can have excellent discrimination (high AUC-ROC) while being poorly calibrated. Consider a model that correctly ranks all positives above all negatives (AUC = 1.0) but assigns probabilities of 0.99 to everything. Its ranking is perfect, but its probabilities are meaningless.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a model is perfectly calibrated if for all probability values p  [0, 1]:' },
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
