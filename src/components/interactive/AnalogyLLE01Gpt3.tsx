import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01Gpt3() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student who has read so much of the world\'s text that you can hand them a few examples of any task — translating French, writing poetry, solving analogies — and they immediately understand what you want, without any additional studying.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-3 uses a standard autoregressive Transformer decoder with 96 layers, 96 attention heads, and a hidden dimension of 12,288. The context window is 2,048 tokens, using the same BPE tokenizer as GPT-2.' },
    { emoji: '🔍', label: 'In Detail', text: 'GPT-3 arrived in May 2020 through a paper by Tom Brown and over 30 co-authors at OpenAI. It was not a radical architectural departure from GPT-2 — it was the same decoder-only Transformer recipe, just scaled to a staggering degree. Where GPT-2 had 1.5 billion parameters, GPT-3 had 175 billion, a 100x increase.' },
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
