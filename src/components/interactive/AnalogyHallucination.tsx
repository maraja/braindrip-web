import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyHallucination() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎭', label: 'Confident Bluffer', text: 'Hallucination is like a dinner guest who, when asked about a topic they don\'t know, confidently makes up plausible-sounding details instead of saying "I don\'t know." The model generates fluent, convincing text that is factually wrong because it\'s optimized for producing likely-sounding token sequences, not for truth. The confidence makes it especially dangerous.' },
    { emoji: '🧩', label: 'Pattern Completion', text: 'Imagine a jigsaw puzzle with missing pieces. Your brain fills in what "looks right" even if the actual piece is different. LLMs do the same — they predict what tokens should come next based on patterns, and sometimes the pattern-matched completion is factually wrong. The model doesn\'t "know" facts; it generates statistically plausible continuations that may or may not align with reality.' },
    { emoji: '📝', label: 'Unreliable Narrator', text: 'In literature, an unreliable narrator tells a story that seems coherent but contains fabrications. LLMs are unreliable narrators by default — they can cite fake papers, invent statistics, describe events that never happened, or attribute quotes to the wrong people, all while sounding completely authoritative. This is why grounding techniques like RAG and citations are essential for factual applications.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
