import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01WordEmbeddingsWord2vecAndGlove() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a vast library, and instead of organizing books by title or author, you arrange them so that books on similar topics sit physically close together on the shelves. Word embeddings do the same thing for words: they assign each word a position in a high-dimensional space so that words with similar meanings cluster together.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Tomas Mikolov and colleagues at Google published two foundational papers in 2013 that introduced Word2Vec with two training architectures. CBOW (Continuous Bag of Words) predicts a target word from its surrounding context window — given "the cat ___ on the mat," predict "sat.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before embeddings, NLP systems represented words as one-hot vectors — enormous sparse arrays where each word was a unique dimension with no notion of similarity. "Cat" and "kitten" were as distant as "cat" and "plutonium." This made generalization nearly impossible.' },
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
