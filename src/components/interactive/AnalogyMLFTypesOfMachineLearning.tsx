import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFTypesOfMachineLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of learning types as different teaching styles. Supervised learning is like a tutor who grades every homework problem -- you always know the right answer. Unsupervised learning is like exploring a library with no catalog -- you discover structure on your own.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a dataset &#123;D&#125; = \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n where x_i  &#123;X&#125; are inputs and y_i  &#123;Y&#125; are labels, the goal is to learn f: &#123;X&#125;  &#123;Y&#125; that generalizes to unseen data. Classification: &#123;Y&#125; is a discrete set of categories. Binary classification ( &gt; 2) includes image recognition (ImageNet has 1,000 classes).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the types are distinguished by the nature of the supervision signal available during training.' },
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
