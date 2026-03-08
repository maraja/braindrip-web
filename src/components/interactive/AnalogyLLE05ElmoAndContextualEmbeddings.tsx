import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05ElmoAndContextualEmbeddings() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you look up the word "bank" in a dictionary. You\'ll find multiple definitions: a financial institution, the side of a river, a pool shot. A static word embedding gives you one vector for "bank" — an average that doesn\'t capture any particular meaning well.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ELMo uses a two-layer bidirectional LSTM trained as a language model. The forward LSTM predicts the next token given the left context; the backward LSTM predicts the previous token given the right context. Critically, both directions are trained independently — they don\'t see each other\'s predictions.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before ELMo, the standard approach was to use frozen, pre-trained word embeddings (Word2Vec, GloVe) as input features. These embeddings were context-independent — the same vector regardless of surrounding text.' },
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
