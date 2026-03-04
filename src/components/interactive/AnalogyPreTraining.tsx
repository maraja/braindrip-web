import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPreTraining() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎓', label: 'General Education', text: 'Pre-training is like K-12 education: the model reads trillions of tokens from the internet, books, and code to build a broad understanding of language, facts, and reasoning. It is not yet specialized — just like a high school graduate knows math, history, and science but has not chosen a career. This phase is massively expensive (millions of GPU-hours) and happens once.' },
    { emoji: '🧠', label: 'Brain Development', text: 'A child\'s brain forms connections by experiencing the world — seeing, hearing, and reading. Pre-training is the model\'s childhood: by predicting the next token on diverse text, it learns grammar, common sense, world knowledge, coding patterns, and even reasoning. The objective is simple (next-token prediction), but the emergent capabilities from scale are remarkable.' },
    { emoji: '🏗', label: 'Foundation Pour', text: 'Pre-training is pouring the concrete foundation of a building. It is the most expensive, time-consuming phase, but everything else rests on it. A poorly poured foundation (bad pre-training data or insufficient compute) limits the entire structure. Once set, you build on it with fine-tuning (framing), alignment (interior design), and deployment (move-in day).' },
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
