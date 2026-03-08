import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFAnomalyDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a factory producing ball bearings. Millions are identical within tight tolerances, but occasionally one comes off the line with an unusual defect. Inspecting every bearing by hand is infeasible; you need an automated system that flags the rare, abnormal ones.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approaches use distributional assumptions:  Z-score: For univariate data assumed to be Gaussian, flag points where  /  &gt;  (typically  = 3). In multivariate settings, use the Mahalanobis distance: d_M(x) = &#123;(x - )^T ^&#123;-1&#125; (x - )&#125;. IQR method: Flag points below Q_1 - 1.5  IQR or above Q_3 + 1.5  IQR.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, anomaly detection identifies observations that do not conform to an expected pattern. These observations are called anomalies, outliers, or novelties. The challenge is that anomalies are rare, diverse (they deviate in unpredictable ways), and often the most important data points -- representing fraud, equipment failure, disease, or.' },
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
