import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTokenizationInNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine receiving a long telegram with no spaces or punctuation: "ARRIVINGTODAYTHREETENMEETMEATSTATION." Before you can understand it, you must figure out where one word ends and the next begins.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest approach: split on spaces and tabs. "The cat sat".split() yields ["The", "cat", "sat"]. This works for clean, space-delimited text but fails on punctuation ("end." becomes a single token), contractions ("don\'t"), hyphenated compounds ("state-of-the-art"), and multiword expressions ("New York City").' },
    { emoji: '🔍', label: 'In Detail', text: 'Tokenization sounds trivial for English -- "just split on spaces" -- but it is surprisingly complex even in English (what about "don\'t," "New York," or "$3.50"?) and becomes a genuine research problem in languages that lack whitespace delimiters (Chinese, Japanese, Thai) or have rich agglutination (Turkish, Finnish).' },
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
