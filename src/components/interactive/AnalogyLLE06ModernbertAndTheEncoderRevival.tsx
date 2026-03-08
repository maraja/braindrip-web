import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06ModernbertAndTheEncoderRevival() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a classic car from the 1960s — beautifully designed, mechanically sound, but overshadowed by modern vehicles with fuel injection, turbocharging, and advanced electronics. Everyone assumes the classic is inferior.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ModernBERT took the basic encoder-only Transformer and upgraded every component to 2024 standards:  Rotary Position Embeddings (RoPE): BERT used learned absolute position embeddings limited to 512 tokens. ModernBERT adopted RoPE from 02-positional-encoding-evolution.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is the story of ModernBERT. The encoder-only architecture pioneered by 03-bert.md in 2018 dominated NLP for two years before the field\'s attention — and investment — shifted decisively toward decoder-only models like GPT-3 and beyond.' },
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
