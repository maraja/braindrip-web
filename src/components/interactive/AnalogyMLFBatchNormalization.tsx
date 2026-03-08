import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFBatchNormalization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a teacher grading exams from different schools. One school\'s exams are scored 0-100, another\'s 0-10, and a third uses letter grades. Before you can fairly compare students, you must standardize the scores.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a mini-batch &#123;B&#125; = \\&#123;x_1, , x_B\\&#125; of pre-activation values at a particular neuron:  Step 1: Compute batch statistics  [equation]  Step 2: Normalize  [equation]  where  (typically 10^&#123;-5&#125;) prevents division by zero.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, Batch Normalization (BatchNorm), introduced by Ioffe and Szegedy in 2015, normalizes the pre-activation values within each mini-batch to have zero mean and unit variance, then applies a learnable affine transformation. This simple operation has dramatic effects on training stability and speed.' },
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
