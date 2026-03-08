import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFMultiClassClassification() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Most real-world classification problems have more than two categories: recognizing handwritten digits (10 classes), classifying news articles by topic (dozens of categories), or diagnosing diseases (hundreds of possible conditions).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most common reduction from multi-class to binary. For each class k:  Construct a binary problem: label all examples of class k as positive, all others as negative. Train a binary classifier f_k(x) that outputs a confidence score.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given input x  &#123;R&#125;^d, the goal is to predict y  \\&#123;1, 2, , K\\&#125;. A multi-class classifier produces a decision function f: &#123;R&#125;^d  \\&#123;1, , K\\&#125;, often via K score functions f_1(x), , f_K(x) with the prediction &#123;y&#125; = _k f_k(x).' },
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
