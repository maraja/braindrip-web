import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSentenceEmbeddings() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to file thousands of sentences into folders based on their meaning. Reading each pair and comparing them manually would take forever. What if you could represent each sentence as a point on a map, where similar sentences cluster together and dissimilar ones are far apart?' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach: average all word vectors in the sentence. Surprisingly effective for many tasks. SIF (Smooth Inverse Frequency) weighting improves this by downweighting common words (similar to IDF) and removing the first principal component:  where a is a parameter (typically 10^-3) and p(w) is the word\'s unigram probability.' },
    { emoji: '🔍', label: 'In Detail', text: 'Sentence embeddings solve a critical problem: word embeddings represent individual words, but most NLP tasks operate on sentences, paragraphs, or documents. You need a way to go from variable-length word sequences to fixed-length vectors that capture the overall meaning.' },
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
