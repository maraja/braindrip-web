import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCAnomalyDetection() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a quality inspector on a factory production line who has seen millions of perfect products but only a handful of defective ones -- and the defects are always different. The inspector learns "normal" so thoroughly that anything unusual instantly stands out.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a training set &#123;D&#125;_&#123;train&#125; = \\&#123;x_1, ..., x_N\\&#125; of normal images, learn a scoring function s(x) such that s(x) is low for normal images and high for anomalous ones. Anomaly localization further produces a pixel-level anomaly map s(x, i, j) for each spatial location.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, anomaly detection (AD) in computer vision is a one-class classification problem. During training, only normal (defect-free) images are available. At inference, the model must detect and localize anomalies it has never seen.' },
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
