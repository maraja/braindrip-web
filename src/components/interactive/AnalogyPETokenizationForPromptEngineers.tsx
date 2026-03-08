import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPETokenizationForPromptEngineers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of tokenization like shipping costs calculated by weight class. A shipping company does not charge by the exact gram — they round up to the nearest bracket. A 1.1 kg package costs the same as a 1.9 kg package. Similarly, LLMs do not process individual characters or whole words — they process tokens, which are subword chunks of varying length.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Byte Pair Encoding starts with individual bytes (or characters) and iteratively merges the most frequent adjacent pairs. After thousands of merge operations on a large training corpus, the vocabulary emerges. Common English words like "the," "and," and "is" become single tokens.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tokenization is the deterministic preprocessing step that converts raw text into a sequence of integer IDs from a fixed vocabulary. It happens before the neural network sees your input. The most common algorithm is Byte Pair Encoding (BPE), which builds a vocabulary by iteratively merging the most frequent character pairs in a training corpus.' },
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
