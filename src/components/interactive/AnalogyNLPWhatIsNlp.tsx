import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPWhatIsNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a Martian to understand English. You would not just hand them a dictionary -- you would need to explain grammar, context, sarcasm, cultural references, ambiguity, and the unspoken rules that native speakers absorb over a lifetime.' },
    { emoji: '⚙️', label: 'How It Works', text: 'NLP\'s history is a story of four major paradigm shifts, each expanding what machines can do with language. Rule-Based Systems (1950s--1980s)  The earliest NLP systems relied on hand-crafted rules. Georgetown-IBM\'s 1954 experiment translated 60 Russian sentences into English using a 250-word vocabulary and six grammar rules.' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, NLP encompasses any computational technique that takes natural language as input, produces natural language as output, or both. This spans a vast range: from a simple regular expression that extracts email addresses to a billion-parameter transformer that writes coherent essays.' },
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
