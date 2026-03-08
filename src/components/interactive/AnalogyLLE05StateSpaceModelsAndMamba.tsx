import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05StateSpaceModelsAndMamba() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two ways to watch a parade. The first is standing on a rooftop where you can see every float simultaneously, comparing any float to any other — that is the Transformer with its all-pairs attention.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Albert Gu et al. introduced the Structured State Space Sequence Model (S4) in late 2021. S4 is based on the continuous-time state space equation: x\'(t) = Ax(t) + Bu(t), y(t) = Cx(t) + Du(t), where A, B, C, D are learned matrices, x is the hidden state, u is the input, and y is the output.' },
    { emoji: '🔍', label: 'In Detail', text: 'State Space Models (SSMs) are a class of sequence models derived from continuous-time dynamical systems. They process sequences by maintaining a hidden state that is updated linearly for each new input — crucially, without the quadratic cost of attention.' },
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
