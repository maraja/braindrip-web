import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03SequenceToSequenceModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a human interpreter at the United Nations. She listens to an entire French speech, builds a mental representation of its meaning, and then produces an English translation. She doesn\'t translate word-by-word — she absorbs the whole input first, then generates the output.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Ilya Sutskever, Oriol Vinyals, and Quoc V. Le at Google published "Sequence to Sequence Learning with Neural Networks" in December 2014 (NeurIPS). The architecture was strikingly simple:  Encoder: A multi-layer LSTM reads the input sequence one token at a time and produces a final hidden state — a single vector (typically 1000 dimensions) that.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before Seq2Seq, machine translation relied on phrase-based statistical methods that aligned source and target phrases using handcrafted features and complex pipelines. These systems (like Moses) required separate language models, translation models, and reordering models.' },
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
