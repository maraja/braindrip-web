import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFStatisticalInference() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'You have a dataset of 10,000 customer transactions. The full population -- all transactions that have ever occurred or will occur -- is unknowable. Statistical inference is the art and science of using the sample you have to make rigorous statements about the population you cannot observe.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A point estimator &#123;&#125; is a function of the sample that produces a single "best guess" for a population parameter . For example, the sample mean &#123;X&#125; = &#123;1&#125;&#123;n&#125;_&#123;i=1&#125;^n X_i estimates the population mean . Desirable properties of estimators:  Unbiasedness: &#123;E&#125;[&#123;&#125;] = .' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of it like tasting soup. You stir the pot (randomize), take a spoonful (sample), and judge the entire pot. If the soup is well-mixed and the spoon is big enough, your judgment will be reliable. Statistical inference formalizes exactly how reliable, quantifying the uncertainty inherent in generalizing from parts to wholes.' },
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
