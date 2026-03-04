import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyNextTokenPrediction() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📱', label: 'Autocomplete', text: 'Next-token prediction is exactly what your phone keyboard does when it suggests the next word. After typing "See you," it predicts "tomorrow" or "later." LLMs do this at massive scale: trained on trillions of words, they learn the probability distribution over all possible next tokens given the preceding context. That simple objective — predict what comes next — is the foundation of modern language models.' },
    { emoji: '🧩', label: 'Jigsaw Puzzle', text: 'Imagine assembling a jigsaw puzzle left to right. Given all the pieces placed so far, you predict which piece fits next based on color, edges, and the emerging picture. The training signal is simple: were you right or wrong? Over billions of examples, the model learns grammar, facts, reasoning, and style — all from this single objective of fitting the next piece.' },
    { emoji: '🎲', label: 'Weighted Dice', text: 'The model rolls a loaded die with one face per vocabulary word. After seeing "The cat sat on the," the die is heavily loaded toward "mat" and "floor" but still has small chances for "table" or "roof." Training adjusts the weighting (probabilities) until the die rolls match real text. At inference, you literally sample from this die to generate each word.' },
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
