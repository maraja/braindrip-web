import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyICL() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎯', label: 'Learning by Example', text: 'Show a child three examples of "red things" and they can identify a fourth red object they\'ve never seen. In-context learning works the same way: you put a few input-output examples in the prompt, and the model extrapolates the pattern to new inputs — without any weight updates. The model doesn\'t "learn" in the training sense; it recognizes and continues the pattern from the examples in context.' },
    { emoji: '🧩', label: 'Pattern Matching', text: 'Give someone the sequence "2, 4, 6, ___" and they say "8." They didn\'t learn math from that sequence — they recognized a pattern and extrapolated. ICL works similarly: the examples in the prompt create a pattern the transformer\'s attention mechanism can recognize and continue. The model is essentially doing sophisticated pattern matching in its activation space, leveraging knowledge from pretraining.' },
    { emoji: '📋', label: 'Template Following', text: 'A new employee given three filled-out forms can fill out the fourth one by copying the format. In-context learning provides the model with "filled-out forms" (examples) that demonstrate the desired input-output mapping. Zero-shot means no examples, few-shot means a handful, and many-shot means dozens. More examples generally improve performance, especially for unusual or ambiguous tasks.' },
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
