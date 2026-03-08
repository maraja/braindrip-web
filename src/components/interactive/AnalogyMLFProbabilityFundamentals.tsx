import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFProbabilityFundamentals() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Uncertainty is inescapable in machine learning. Training data is a noisy sample from a larger population. Predictions are inherently uncertain. Models must quantify how confident they are. Probability theory provides the rigorous mathematical framework for reasoning about uncertainty.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A sample space  is the set of all possible outcomes. An event A   is a subset of outcomes. A probability measure P assigns values to events satisfying Kolmogorov\'s axioms:  P(A)  0 for all events A P() = 1 For mutually exclusive events A_1, A_2, : P(_i A_i) = _i P(A_i)  From these axioms, all of probability theory follows.' },
    { emoji: '🔍', label: 'In Detail', text: 'Think of probability as a way to assign a number between 0 and 1 to events, where 0 means impossible and 1 means certain. If you flip a fair coin, the probability of heads is 0.5 -- not because the outcome is inherently random (physics could predict it) but because your information about the outcome is incomplete.' },
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
