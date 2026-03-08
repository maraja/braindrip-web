import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPETemperatureAndSampling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine adjusting a faucet between ice-cold precision and scalding-hot creativity. At the cold end (temperature = 0), the water flows in a single, predictable stream — the model always picks the most probable next token, producing consistent, safe, and sometimes boring output. Crank the handle toward hot (temperature = 1.0-2.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Temperature (T) is applied to the raw logits before the softmax function: softmax(logits / T). The effect is mathematically precise:  T = 0 (or effectively 0.01): The softmax becomes a hard argmax. The highest-probability token is always selected.' },
    { emoji: '🔍', label: 'In Detail', text: 'After the LLM processes your prompt through its transformer layers, it outputs a probability distribution (logits) over the entire vocabulary for the next token. "The" might have probability 0.3, "A" might have 0.15, "In" might have 0.08, and so on down to thousands of tokens with vanishingly small probabilities.' },
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
