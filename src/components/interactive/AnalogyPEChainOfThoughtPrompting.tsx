import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEChainOfThoughtPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are taking a math exam. If the instructions say "show your work," you are far more likely to arrive at the correct answer than if you just write down a number. You catch your own mistakes, you keep track of intermediate values, and the structure of the problem becomes visible on the page.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LLMs generate text one token at a time. When a model must jump directly from a question to an answer, it has to compress all reasoning into the hidden states of a single forward pass.' },
    { emoji: '🔍', label: 'In Detail', text: 'The technique was introduced by Wei et al. (2022) at Google Brain and demonstrated that simply adding reasoning traces to few-shot examples could unlock arithmetic, commonsense, and symbolic reasoning capabilities that standard prompting could not.' },
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
