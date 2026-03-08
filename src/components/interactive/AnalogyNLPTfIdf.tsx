import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTfIdf() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are searching for articles about "black holes." The word "the" appears in every article, so it tells you nothing about relevance. The word "singularity," however, appears in very few articles -- and when it does, those articles are probably about black holes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a term t in document d:  Raw count: tf(t, d) = f(t, d), the number of times t appears in d. Log-normalized: tf(t, d) = 1 + log(f(t, d)) if f(t, d) &gt; 0, else 0. This dampens the effect of high-frequency terms -- a word appearing 100 times is not 100x more important than a word appearing once.' },
    { emoji: '🔍', label: 'In Detail', text: 'TF-IDF stands for Term Frequency--Inverse Document Frequency. It assigns each word in a document a weight that is the product of two components: how often the word appears in that document (TF) and how rare the word is across all documents (IDF).' },
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
