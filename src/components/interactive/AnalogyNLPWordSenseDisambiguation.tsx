import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPWordSenseDisambiguation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the word "bank." In "She sat by the river bank," it means the sloping land beside water. In "She deposited money at the bank," it means a financial institution. Humans resolve this effortlessly -- you probably did not even pause.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Lesk Algorithm (1986)  The original Lesk algorithm disambiguates a word by comparing dictionary definitions (glosses) of its senses to the glosses of surrounding words. The sense whose gloss shares the most words with neighboring glosses wins.' },
    { emoji: '🔍', label: 'In Detail', text: 'More formally, given a target word w in a sentence and a predefined inventory of senses S = &#123;s1, s2, ..., sn&#125; for that word, WSD selects the sense si that best fits the context. The sense inventory is typically drawn from a lexical resource such as WordNet, which lists 117,659 synonym sets (synsets) across English.' },
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
