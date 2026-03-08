import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPElmo() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a dictionary where instead of a single definition per word, the definition changes dynamically depending on the sentence the word appears in. The word "bank" would have one representation in "river bank" and a completely different one in "bank account." Static word embeddings like word2vec.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Character-Level Input. Unlike Word2Vec or GloVe, which use a fixed vocabulary of whole words, ELMo processes words through a character-level convolutional neural network. Each word is represented as a sequence of characters, processed by CNN filters of widths 1-7, then max-pooled and projected through highway layers to produce a.' },
    { emoji: '🔍', label: 'In Detail', text: 'ELMo, introduced by Peters et al. (2018) from the Allen Institute for AI, stands for Embeddings from Language Models. It pre-trains a two-layer bidirectional LSTM on a large corpus using a language modeling objective, then extracts the internal representations (from all layers) as features for downstream tasks.' },
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
