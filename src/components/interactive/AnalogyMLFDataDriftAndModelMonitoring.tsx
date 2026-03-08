import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFDataDriftAndModelMonitoring() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you trained a weather prediction model using data from temperate climates, and then deployed it in the tropics. The model never saw monsoon patterns during training, so its predictions silently deteriorate. Nobody notices until a costly failure occurs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'There are several distinct forms of drift, each with different causes and detection strategies:  Covariate Shift (Feature Drift): The input distribution P(X) changes while the relationship P(Y|X) remains stable.' },
    { emoji: '🔍', label: 'In Detail', text: 'Data drift is the phenomenon where the statistical properties of production data diverge from those of the training data over time. Because ML models are fundamentally pattern-matching machines fitted to a training distribution, any shift in that distribution degrades model performance -- often without any explicit error signal.' },
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
