import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFOverfittingAndUnderfitting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine studying for an exam. Underfitting is like skimming the textbook once and missing the core ideas -- you fail because you did not learn enough. Overfitting is like memorizing every practice problem word-for-word, including the typos -- you ace the practice set but bomb the actual exam because you memorized specifics instead of understanding.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The primary diagnostic is the gap between training performance and validation performance. Quantitatively, if training loss is &#123;L&#125;_&#123;train&#125; and validation loss is &#123;L&#125;_&#123;val&#125;:  Underfitting: &#123;L&#125;_&#123;train&#125; is high (the model cannot fit even the training data). Overfitting: &#123;L&#125;_&#123;val&#125; - &#123;L&#125;_&#123;train&#125;  0 (large generalization gap).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, overfitting occurs when a model performs significantly better on training data than on unseen test data, indicating it has captured noise or idiosyncratic patterns in the training set rather than the true underlying relationship.' },
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
