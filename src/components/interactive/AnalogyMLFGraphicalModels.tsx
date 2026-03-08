import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFGraphicalModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to reason about the weather, whether your lawn sprinkler is on, and whether the grass is wet. These variables are not independent -- rain affects wet grass, the sprinkler affects wet grass, and your decision to turn on the sprinkler depends on whether it is cloudy.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A Bayesian network is a directed acyclic graph (DAG) where each node X_i has a conditional probability distribution given its parents Pa(X_i). The joint distribution factorizes as:  [equation]  This factorization can dramatically reduce the number of parameters.' },
    { emoji: '🔍', label: 'In Detail', text: 'Graphical models provide a language for compactly representing high-dimensional joint distributions by exploiting conditional independence structure. They come in two main flavors: directed (Bayesian networks) and undirected (Markov random fields).' },
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
