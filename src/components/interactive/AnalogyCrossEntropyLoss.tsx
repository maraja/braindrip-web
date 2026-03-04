import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCrossEntropyLoss() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎯', label: 'Confidence Penalty', text: 'Cross-entropy loss penalizes the model based on how confident it was in the correct answer. If the right token was "cat" and the model gave it 90% probability, the penalty is small. If it gave "cat" only 1%, the penalty is enormous. It is like a quiz where you bet money on your answers — being confidently wrong costs you far more than being uncertainly wrong.' },
    { emoji: '🌦', label: 'Weather Forecast', text: 'A weather forecaster predicts 10% chance of rain, then it rains. Cross-entropy measures how "surprised" the forecast was — very surprised (high loss) in this case. If they had predicted 95% rain, the surprise (loss) would be tiny. The model is trained to minimize surprise: assign high probability to tokens that actually appear in the training data.' },
    { emoji: '📏', label: 'Distribution Gap', text: 'Imagine two histograms: the "true" distribution (100% on the correct next token) and the model\'s predicted distribution (spread across the vocabulary). Cross-entropy measures the gap between them. The loss is minimized when the model\'s distribution matches the true one perfectly. It is the standard training signal for language models — the gradient of "how wrong is your probability assignment?"' },
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
