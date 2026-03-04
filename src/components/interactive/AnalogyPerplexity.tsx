import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPerplexity() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '😮', label: 'Surprise Level', text: 'Perplexity measures how "surprised" a model is by text. If the model sees "The cat sat on the ___" and correctly predicts "mat," it\'s not surprised (low perplexity). If the text says "The cat sat on the quantum," it\'s very surprised (high perplexity). Mathematically, it\'s the exponentiated average negative log-likelihood: lower = the model predicts the text better = better language understanding.' },
    { emoji: '🎲', label: 'Guessing Game', text: 'Imagine guessing the next word in a sentence. If you\'re choosing between 10 equally likely words on average, your perplexity is 10. If you\'re choosing between 100, it\'s 100. Lower perplexity = the model narrows down the right answer more effectively. A perplexity of 1 means perfect prediction. Real models score 10-30 on standard text, meaning they effectively choose between 10-30 candidates per token.' },
    { emoji: '🧭', label: 'Navigation Confidence', text: 'A GPS with high confidence says "turn right in 100 meters." One with low confidence says "maybe turn right... or left... or go straight?" Perplexity measures this confidence across a whole text: how uncertain is the model about each next word on average? It\'s the standard intrinsic metric for language models — lower perplexity means the model has learned the language patterns better. But low perplexity alone doesn\'t guarantee helpful or truthful outputs.' },
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
