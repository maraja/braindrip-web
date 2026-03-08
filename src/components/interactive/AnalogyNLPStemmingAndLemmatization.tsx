import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPStemmingAndLemmatization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an index at the back of a textbook. You want to find all pages discussing "running," "runs," "ran," and "runner." A good index groups them under a single entry. Stemming and lemmatization do the same for NLP: they map inflected word forms back to a shared base so that a search for "run" retrieves documents containing any of its variants.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### The Porter Stemmer  Martin Porter\'s 1980 algorithm applies 5 phases of suffix-removal rules conditioned on a measure of the word\'s "consonant-vowel" pattern. For example:  Phase 1a: "caresses" -&gt; "caress", "ponies" -&gt; "poni" Phase 1b: "agreed" -&gt; "agree", "plastered" -&gt; "plaster" Phase 5: "probate" -&gt; "probat", "rate" -&gt; "rate"  The algorithm.' },
    { emoji: '🔍', label: 'In Detail', text: 'Stemming is the fast, approximate approach: it strips suffixes using hand-crafted rules, often producing non-words ("studies" becomes "studi," "arguing" becomes "argu"). Think of it as pruning branches with hedge clippers -- fast but imprecise.' },
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
