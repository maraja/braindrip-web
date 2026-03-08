import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPGatedRecurrentUnits() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are editing a document with "track changes" enabled. At each revision, you have two decisions: how much of the old text to keep (the update gate) and how much of the old context to consider when writing new text (the reset gate). You do not need a separate notebook and a separate draft -- you work directly on one document.' },
    { emoji: '⚙️', label: 'How It Works', text: 'At each time step t, given input x_t and previous hidden state h_&#123;t-1&#125;:  Update gate -- controls how much of the previous state to carry forward:  Reset gate -- controls how much of the previous state to expose when computing the candidate:  Candidate hidden state -- new information proposal:  Hidden state update -- interpolation between old and.' },
    { emoji: '🔍', label: 'In Detail', text: 'The Gated Recurrent Unit (GRU) was introduced by Cho et al. (2014) as a simpler alternative to the LSTM. Where the LSTM maintains two separate vectors (cell state C_t and hidden state h_t) controlled by three gates, the GRU uses a single hidden state h_t governed by two gates: the update gate z_t (analogous to the LSTM\'s forget and input gates.' },
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
