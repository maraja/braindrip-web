import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFPerceptronsAndMultilayerNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a committee member who votes yes or no on a proposal. They weigh different factors (cost, timeline, quality), multiply each by how much they care about it, sum the weighted opinions, and decide: if the total exceeds some threshold, they vote yes. A single perceptron works exactly this way -- it is the simplest possible neural network.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The perceptron learning algorithm updates weights only when a misclassification occurs. For a training example (x, y^) where y^ is the true label and &#123;y&#125; is the prediction:  [equation] [equation]  where  is the learning rate.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the perceptron is a binary classifier proposed by Frank Rosenblatt in 1958. Given an input vector x  &#123;R&#125;^d, the perceptron computes:' },
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
