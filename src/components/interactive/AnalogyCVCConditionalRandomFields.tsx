import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCConditionalRandomFields() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a pixel-level segmentation prediction from a neural network, but it looks blobby -- edges are fuzzy, small regions are misclassified, and neighboring pixels with similar colors sometimes get different labels.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The fully connected CRF used in segmentation (Krahenbuhl and Koltun, 2011) defines:  [equation]  Unary potential _u(x_i): the cost of assigning label x_i to pixel i, derived directly from the neural network\'s softmax output:  [equation]  If the network is confident that pixel i is "road," the unary cost for labeling it "road" is low.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, a CRF defines a conditional probability distribution over label assignments x = \\&#123;x_1, , x_N\\&#125; (one label per pixel) given the observed image I:' },
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
