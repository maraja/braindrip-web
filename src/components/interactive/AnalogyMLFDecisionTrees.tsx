import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFDecisionTrees() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine diagnosing a car problem by asking a series of yes/no questions: "Does the engine start?" If no, "Is the battery dead?" If yes, "Does it make a clicking sound?" Each question narrows the possibilities until you reach a diagnosis.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Classification and Regression Trees (CART) algorithm builds the tree top-down via greedy recursive splitting:  For each feature j and each possible threshold t, split the current node\'s data into two groups: \\&#123;x : x_j  t\\&#125; and \\&#123;x : x_j &gt; t\\&#125;. Evaluate each split using an impurity measure (below).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a decision tree is a directed acyclic graph where each internal node applies a test x_j  t (for feature j at threshold t), each branch corresponds to the test outcome, and each leaf node assigns a class label (classification) or a continuous value (regression). The prediction for a new input follows a path from root to leaf.' },
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
