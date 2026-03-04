import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyBackpropagation() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏔', label: 'Mountain Descent', text: 'The model sits on a mountain (high loss) and needs to reach the valley (low loss). Backpropagation calculates which direction is downhill for every parameter — it is the compass. Starting from the summit (output error), it traces the path backward through every layer, computing how each weight contributed to the error and how it should change. Then gradient descent takes the step.' },
    { emoji: '🔗', label: 'Chain of Blame', text: 'When a product is defective, you trace the problem back through the supply chain: the final inspector blames assembly, who blames the parts supplier, who blames raw materials. Backpropagation is this chain of blame (the chain rule of calculus): the output error is traced backward, assigning each layer and weight its share of responsibility for the mistake.' },
    { emoji: '💧', label: 'River Flowing Back', text: 'Imagine water flowing forward through pipes (forward pass) to produce an output. Now reverse the flow: the error signal flows backward through the same pipes, and at each junction (layer), it tells each valve (weight) whether to open wider or close slightly. This reverse flow computes gradients — the recipe for updating every parameter to reduce the error next time.' },
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
