import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFAdaboost() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student preparing for an exam by taking practice tests. After each test, instead of re-studying everything equally, the student focuses on the questions they got wrong. Over successive rounds, the student\'s effort is concentrated on the hardest material, and their overall performance steadily improves.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given training data \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n with y_i  \\&#123;-1, +1\\&#125;:  Initialize sample weights: w_i^&#123;(1)&#125; = &#123;1&#125;&#123;n&#125; for all i. For t = 1, 2, , T:  Train weak learner h_t on the weighted dataset. The learner minimizes weighted classification error:  [equation]  Compute learner weight:  [equation]     Note: _t &gt; 0 when _t &lt; 0.' },
    { emoji: '🔍', label: 'In Detail', text: 'AdaBoost (Adaptive Boosting), introduced by Yoav Freund and Robert Schapire in 1995, formalizes this intuition. It trains a sequence of weak learners -- classifiers only slightly better than random guessing -- and combines them into a single strong classifier.' },
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
