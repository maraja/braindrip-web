import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02RecurrentNeuralNetworksAndLstms() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a book one word at a time, keeping a mental summary in your head that you update with each new word. By the time you reach the end of a sentence, your summary reflects everything you\'ve read — but earlier words have faded.' },
    { emoji: '⚙️', label: 'How It Works', text: 'At each timestep t, the RNN computes: h_t = tanh(W_hh  h_&#123;t-1&#125; + W_xh  x_t + b), where h_t is the hidden state, x_t is the input (usually a word embedding from 01-word-embeddings-word2vec-and-glove.md), and W_hh and W_xh are learned weight matrices.' },
    { emoji: '🔍', label: 'In Detail', text: 'This was a natural fit for language, which is inherently sequential. Feedforward networks had no mechanism for handling variable-length sequences or remembering what came before.' },
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
