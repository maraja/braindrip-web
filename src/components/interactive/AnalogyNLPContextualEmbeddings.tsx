import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPContextualEmbeddings() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the word "bank." In "I deposited money at the bank," it means a financial institution. In "The boat drifted toward the river bank," it means a shoreline. In "You can bank on it," it is a verb meaning to rely on.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Static embeddings map each word type to a fixed vector:  Contextual embeddings map each word token (in context) to a vector:  The two vectors for "bank" will be substantially different, reflecting the different meanings.' },
    { emoji: '🔍', label: 'In Detail', text: 'Contextual embeddings solve this by producing a different vector for "bank" in each sentence. The representation of each word is a function of the entire sentence (or even paragraph) surrounding it. Think of it like a chameleon: the word takes on the color of its environment.' },
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
