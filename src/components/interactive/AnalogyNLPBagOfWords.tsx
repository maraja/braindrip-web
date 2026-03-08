import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPBagOfWords() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine dumping every word from a book into a bag, shaking it up, and counting how many times each word appears. You lose all information about word order -- "dog bites man" and "man bites dog" become identical -- but you retain a surprisingly useful fingerprint of what the text is about. That is the Bag of Words (BoW) model.' },
    { emoji: '⚙️', label: 'How It Works', text: 'First, build a vocabulary V = &#123;w_1, w_2, ..., w_&#125; from the entire corpus. Typical steps include lowercasing, removing punctuation, applying stopword removal, and optionally stemming or lemmatizing. Vocabulary sizes range from a few thousand (after aggressive filtering) to hundreds of thousands for large corpora.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, BoW represents a document as a vector in R^ is the vocabulary size. Each dimension corresponds to one word in the vocabulary, and the value at that dimension indicates the word\'s presence or frequency in the document.' },
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
