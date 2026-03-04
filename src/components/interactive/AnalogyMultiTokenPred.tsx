import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMultiTokenPred() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '♟️', label: 'Planning Ahead', text: 'A chess player thinking one move ahead plays differently than one thinking three moves ahead. Multi-token prediction trains the model to predict not just the next token but the next 2, 4, or 8 tokens simultaneously. This forces the model to plan ahead — it must consider what\'s coming several steps later, encouraging better internal representations and more coherent long-range generation.' },
    { emoji: '🎯', label: 'Bowling Setup', text: 'A bowler doesn\'t just aim for the first pin — they aim to set up a chain reaction across all ten. Multi-token prediction similarly forces the model to optimize across multiple future positions at once. During training, separate prediction heads forecast each future position, sharing the same backbone representations. This improves sample efficiency (more learning signal per example) and can enable faster inference with speculative decoding.' },
    { emoji: '📖', label: 'Speed Reading', text: 'A speed reader processes groups of words at once rather than one word at a time. Multi-token prediction trains the model to "think in phrases" rather than individual tokens. Meta\'s research showed this improves coding performance significantly — because code has more predictable multi-token patterns (function signatures, common idioms). The model learns higher-level patterns instead of just local token transitions.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
