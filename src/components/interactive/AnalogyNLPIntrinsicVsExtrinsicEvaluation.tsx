import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPIntrinsicVsExtrinsicEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine evaluating a car engine. An intrinsic evaluation would test the engine on a dynamometer -- measuring horsepower, torque, and fuel efficiency in isolation on a test bench. An extrinsic evaluation would install the engine in a car and measure lap times around a track.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Perplexity for Language Models: The most common intrinsic metric for language models (see n-gram-language-models.md, gpt-for-nlp-tasks.md) measures how well the model predicts held-out text. Lower perplexity means better prediction. GPT-2 (1.5B) achieves 17.5 perplexity on Penn Treebank vs.' },
    { emoji: '🔍', label: 'In Detail', text: 'In NLP, intrinsic evaluation tests a model component (embeddings, a language model, a parser) using metrics tied directly to that component\'s objective -- word analogy accuracy for embeddings, perplexity for language models, attachment scores for parsers.' },
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
