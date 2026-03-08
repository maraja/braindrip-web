import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPRecurrentNeuralNetworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a book one word at a time while trying to keep a running mental summary in your head. After each word, you update your summary based on what you just read and what you remembered so far.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a sequence of T tokens, the RNN "unrolls" into T copies of the same cell, each feeding its hidden state forward:  Initialize h_0 (typically a zero vector of dimension d_h). For each time step t = 1 to T:    - Combine the input embedding x_t (dimension d_x) with the previous hidden state h_&#123;t-1&#125; (dimension d_h).' },
    { emoji: '🔍', label: 'In Detail', text: 'A Recurrent Neural Network is a class of neural networks where connections between units form a directed cycle through time. Unlike feedforward networks that process a fixed-size input in one pass, RNNs process a sequence of inputs (x_1, x_2, ..., x_T) step by step.' },
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
