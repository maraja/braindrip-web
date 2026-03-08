import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCConvolutionInNeuralNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine running a small magnifying glass across a photograph. At each position, the glass highlights a tiny patch and summarizes what it sees -- an edge, a color gradient, a texture. The glass itself never changes; it applies the same inspection everywhere.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Unlike a fully connected layer where every input unit connects to every output unit, a convolutional neuron only sees a small spatial neighborhood defined by the kernel size. For a 3 x 3 kernel on a 224 x 224 input, each output neuron depends on just 9 spatial positions per channel, rather than all 50,176.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, the discrete 2D convolution (technically cross-correlation in most frameworks) between an input I and a kernel K of size k x k is:' },
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
