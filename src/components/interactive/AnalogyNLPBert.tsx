import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPBert() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to understand a sentence with one eye closed -- you can only see words to the left of whatever word you are currently reading. That is how traditional language models like GPT-1 work: they process text left-to-right. Now open both eyes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Masked Language Modeling (MLM). BERT randomly masks 15% of input tokens and trains the model to predict them from their bidirectional context. Of the selected tokens, 80% are replaced with [MASK], 10% with a random token, and 10% are left unchanged.' },
    { emoji: '🔍', label: 'In Detail', text: 'BERT, introduced by Devlin et al. (2019) at Google, is a pre-trained transformer encoder that learns bidirectional representations of text. Unlike elmo.md, which concatenates independently trained left-to-right and right-to-left models, BERT uses a masked language modeling (MLM) objective that allows every position to attend to every other.' },
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
