import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyLogitsAndSoftmax() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🗳', label: 'Election Votes', text: 'Logits are like raw vote tallies for each candidate (token). "The" got 47 points, "a" got 32, "my" got 28. Softmax converts these raw tallies into percentages that sum to 100%: "The" has 52%, "a" has 29%, "my" has 19%. Now you have a proper probability distribution you can sample from to pick the next word.' },
    { emoji: '🌡', label: 'Temperature Dial', text: 'Logits are raw scores the model assigns to each possible next token. Softmax is like converting those scores through a temperature-controlled funnel. At low temperature, the highest score dominates (deterministic). At high temperature, scores flatten out (more random). The temperature parameter literally divides the logits before softmax, controlling creativity vs. precision.' },
    { emoji: '🏇', label: 'Horse Race Odds', text: 'Before a horse race, bookmakers assign raw power ratings to each horse (logits). But bettors need odds that sum to 100%. Softmax converts power ratings into betting probabilities by exponentiating each score and normalizing. A horse with a slightly higher rating gets disproportionately better odds because exponentiation amplifies differences.' },
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
