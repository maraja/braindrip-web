import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyContextExtension() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔭', label: 'Telescope Upgrade', text: 'A telescope trained to focus at one distance can be recalibrated to see farther. Context window extension recalibrates position encodings (like RoPE) so a model trained on 4K tokens can process 128K or more. Techniques like YaRN and NTK-aware scaling modify how the model encodes position information, stretching its "vision" to longer sequences without full retraining from scratch.' },
    { emoji: '📏', label: 'Ruler Extension', text: 'A ruler marked to 30cm can\'t measure a 100cm table. Position embeddings are the model\'s ruler — they tell it where each token is in the sequence. Context extension is like adding markings beyond 30cm. RoPE scaling adjusts the frequency of rotary embeddings, while ALiBi uses linear bias that naturally extrapolates. The challenge: extending the ruler while maintaining accuracy at previously learned distances.' },
    { emoji: '🏗️', label: 'Building Addition', text: 'Extending a building requires careful engineering so the new wing integrates with the existing structure. Context extension modifies the position encoding system and fine-tunes on longer sequences so the model can handle longer inputs without degradation. The key insight: you don\'t need to retrain from scratch — a relatively small amount of long-context fine-tuning can extend the window by 8-32x.' },
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
