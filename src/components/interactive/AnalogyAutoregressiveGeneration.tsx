import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAutoregressiveGeneration() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧶', label: 'Knitting', text: 'Autoregressive generation is like knitting a scarf: each stitch depends on the one before it. You cannot knit row 5 until rows 1-4 are done. The model generates one token at a time, feeding each new token back as input for the next. The sequence grows stitch by stitch, with each choice shaping everything that follows.' },
    { emoji: '🎤', label: 'Freestyle Rap', text: 'A freestyle rapper builds their verse one word at a time: each new word must rhyme and flow with everything said so far. They cannot jump ahead to the punchline. Autoregressive generation works the same way — the model conditions on all previously generated tokens to produce the next one, building coherent text sequentially.' },
    { emoji: '🍕', label: 'Pizza Toppings', text: 'Imagine building a pizza where each topping choice depends on what is already on it. You placed pepperoni, so now mushrooms make sense. The mushrooms suggest olives. Each decision is informed by the cumulative result so far. The model similarly conditions each new token on the full sequence generated up to that point.' },
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
