import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFOptimizationAndGradientDescent() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Training a machine learning model is, at its core, an optimization problem. You have a loss function &#123;L&#125;(&#123;&#125;) that quantifies how poorly the model (parameterized by &#123;&#125;) fits the data, and your goal is to find the parameter values that minimize it:' },
    { emoji: '⚙️', label: 'How It Works', text: 'A function f is convex if the line segment between any two points on its graph lies above or on the graph:  [equation]  For convex functions, every local minimum is a global minimum, and gradient descent is guaranteed to converge to it. Linear regression and logistic regression have convex loss surfaces.' },
    { emoji: '🔍', label: 'In Detail', text: 'Imagine you are blindfolded on a mountain range and can only feel the slope beneath your feet. You take a step downhill, feel the slope again, step again. This is gradient descent: a simple, iterative algorithm that uses local slope information to navigate toward a minimum.' },
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
