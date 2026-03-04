import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGrokking() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '💡', label: 'Aha Moment', text: 'A student memorizes multiplication tables perfectly (training accuracy 100%) but cannot multiply new numbers (test accuracy low). Then, after much more practice, understanding suddenly clicks — they grasp the pattern and can generalize. Grokking is this delayed "aha moment": the model memorizes the training set quickly but only learns the generalizable algorithm after far more training steps.' },
    { emoji: '🌱', label: 'Late Bloomer', text: 'A seed planted in soil shows no growth for weeks (memorization phase). Then suddenly a sprout appears and grows rapidly (generalization phase). Grokking is like a late-blooming plant: training loss reaches zero early (the model has memorized), but the internal representations continue reorganizing silently until a structured, generalizable algorithm crystallizes — sometimes thousands of epochs later.' },
    { emoji: '🧮', label: 'Rote to Reasoning', text: 'Imagine learning modular arithmetic. First you memorize: 3+4 mod 5 = 2, 2+3 mod 5 = 0. Your "training accuracy" is perfect but you are just recalling facts. With more practice, you discover the circular pattern and suddenly generalize to any numbers. Grokking reveals that neural networks can undergo this same transition from memorization to understanding — but only with sufficient weight decay and continued training.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
