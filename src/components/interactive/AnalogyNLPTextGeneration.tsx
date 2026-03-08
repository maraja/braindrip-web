import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTextGeneration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an improvising jazz musician. Given an opening phrase (a prompt), they must decide which note to play next -- and then the next, and the next. They could always pick the single "safest" note (greedy decoding), plan several bars ahead and choose the best overall sequence (beam search), or introduce controlled randomness for creative.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a language model that produces P(x_t | x_&#123;&lt;t&#125;) at each step, the decoding strategy selects which token to emit. Greedy Decoding: Always pick the highest-probability token: x_t = argmax P(x_t | x_&#123;&lt;t&#125;). Fast and deterministic, but often produces repetitive, degenerate text because it never explores alternative continuations.' },
    { emoji: '🔍', label: 'In Detail', text: 'Text generation is the task of producing natural language text, typically one token at a time, from a language model. The model assigns probabilities to the next token given the preceding context, and the decoding strategy determines how those probabilities are converted into actual output.' },
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
