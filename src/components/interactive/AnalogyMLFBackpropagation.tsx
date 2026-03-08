import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFBackpropagation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are managing a long assembly line where each station modifies a product. A defect appears at the end. To fix it, you trace backward through each station, asking: "How much did your adjustment contribute to the final defect?' },
    { emoji: '⚙️', label: 'How It Works', text: 'For a composite function L = L(f(g(x))), the chain rule gives:  [equation]  In a neural network with L layers, the loss depends on the parameters through a chain of compositions. Backpropagation evaluates this chain from right to left (output to input), accumulating products of local Jacobians.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, backpropagation is an efficient algorithm for computing the gradient of a scalar loss function L with respect to every parameter in a neural network. It applies the chain rule of calculus systematically on a computational graph, reusing intermediate results to avoid redundant computation.' },
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
