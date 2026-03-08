import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPBidirectionalRnns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are solving a crossword puzzle. To figure out the answer for a clue at position 5, you look at the letters you have already filled in to the left (past context) and the letters to the right (future context). A standard left-to-right RNN only sees the leftward letters -- it is solving the crossword blindfolded on one side.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given an input sequence (x_1, x_2, ..., x_T):  Forward pass (left to right):  Backward pass (right to left):  Combined representation at each position:  The forward and backward RNNs have completely separate parameters. If each uses a hidden dimension of d_h, the concatenated representation has dimension 2 * d_h.' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, a bidirectional RNN consists of two independent RNN layers (typically LSTMs or GRUs) that process the input sequence in opposite directions. At each time step t, the forward RNN produces a hidden state h_t_forward from (x_1, ..., x_t) and the backward RNN produces h_t_backward from (x_T, ..., x_t).' },
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
