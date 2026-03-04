import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySpeculativeDecoding() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '✏️', label: 'Draft & Editor', text: 'A junior writer (small draft model) quickly writes several sentences. A senior editor (large target model) reviews them all at once, accepting the good parts and rewriting from the first mistake. This is faster than the editor writing everything from scratch because verification is cheaper than generation — the big model checks multiple tokens in a single forward pass.' },
    { emoji: '🎯', label: 'Branch Prediction', text: 'Like a CPU that speculatively executes the predicted branch while waiting for the condition to resolve, speculative decoding guesses ahead with a fast small model. The large model verifies the guesses in parallel. If the guess is right (often the case for common patterns), you\'ve generated multiple tokens in the time of one large-model step. Wrong guesses are simply discarded.' },
    { emoji: '🏃', label: 'Pace Runner', text: 'In a marathon, a pace runner leads the group at a target speed. Speculative decoding uses a lightweight draft model as the pace runner — sprinting ahead to propose the next 5-10 tokens. The large model then verifies these proposals in one batch (much faster than generating them one by one). The output is mathematically identical to running the large model alone, just faster.' },
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
