import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFAbTestingForMl() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have developed a new recommendation model that achieves 5% better recall on your test set. You deploy it, expecting a revenue increase -- and revenue drops. What happened? The test set did not capture user fatigue, network effects, or the feedback loops that exist in a live system.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Offline metrics (accuracy, AUC, RMSE on held-out data) measure how well a model fits historical patterns. But production introduces dynamics that offline evaluation cannot capture:  Feedback loops: A recommendation model influences what users see, which influences future behavior, which influences future training data.' },
    { emoji: '🔍', label: 'In Detail', text: 'A/B testing is the gold standard for measuring the causal effect of a model change in production. Users are randomly split into groups: the control group receives predictions from the current model (A), and the treatment group receives predictions from the new model (B).' },
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
