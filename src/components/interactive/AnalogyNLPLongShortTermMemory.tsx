import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPLongShortTermMemory() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are taking notes during a long lecture. Unlike just trying to remember everything in your head (a vanilla RNN), you have a notebook (the cell state). At each moment, you decide what to erase from your notes (forget gate), what new information to write down (input gate), and what to read aloud from your notes when someone asks you a.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The cell state C_t is the defining feature of the LSTM. Think of it as a conveyor belt running through the entire sequence. Information rides along this belt, modified only by additive updates and multiplicative gates -- both linear operations that preserve gradient magnitude.' },
    { emoji: '🔍', label: 'In Detail', text: 'Long Short-Term Memory (LSTM) is a recurrent neural network architecture introduced by Hochreiter and Schmidhuber in 1997, specifically designed to learn long-range dependencies.' },
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
