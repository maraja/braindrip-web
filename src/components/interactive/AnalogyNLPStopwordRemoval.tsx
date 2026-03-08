import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPStopwordRemoval() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine listening to a speech and trying to take notes on the key ideas. You would naturally skip filler words like "the," "is," and "very" and write down the content-bearing words: nouns, verbs, adjectives.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### NLTK  NLTK provides stopword lists for 23 languages. The English list contains 179 words:  #### spaCy  spaCy\'s English stopword list contains 326 words, including single-letter tokens and some additional function words.' },
    { emoji: '🔍', label: 'In Detail', text: 'The term "stop list" was coined by Hans Peter Luhn in 1958 at IBM. The idea is straightforward: in English, the 100 most frequent words account for approximately 50% of all word occurrences in a typical corpus, yet they contribute almost nothing to distinguishing one document from another.' },
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
