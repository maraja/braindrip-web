import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01AttentionIsAllYouNeed() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a room full of people having a conversation. In the RNN world, each person can only whisper to the person next to them, and messages degrade as they pass down the line. In the Transformer world, every person can directly talk to every other person simultaneously.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Transformer\'s fundamental operation is scaled dot-product attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. Each position in the sequence produces three vectors — Query (what am I looking for?), Key (what do I contain?), and Value (what do I provide?) — by multiplying the input by three learned weight matrices.' },
    { emoji: '🔍', label: 'In Detail', text: 'The Transformer was born at Google in 2017, the product of a team split between Google Brain and Google Research. The paper "Attention Is All You Need" made a radical claim in its very title: you don\'t need recurrence, you don\'t need convolutions — attention alone is sufficient to model sequences. This was counterintuitive.' },
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
