import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySamplingStrategies() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎲', label: 'Dice with Weights', text: 'The model outputs a probability distribution over all tokens. Sampling strategies decide how to roll the dice. Greedy always picks the highest probability (loaded die). Temperature adjusts how loaded the die is — high temperature makes it fairer (more random), low temperature makes it more biased toward the top choice. Top-k only keeps the k best faces; top-p keeps faces until cumulative probability hits a threshold.' },
    { emoji: '🍦', label: 'Ice Cream Shop', text: 'Greedy sampling always picks the most popular flavor. Top-k sampling considers only the top 5 flavors. Top-p (nucleus) sampling considers flavors until you\'ve covered 90% of people\'s preferences. Temperature controls adventurousness: low temperature = vanilla every time, high temperature = might try durian. Each strategy trades off between safe/predictable and creative/diverse outputs.' },
    { emoji: '🎨', label: 'Paint Palette', text: 'Think of each token choice as picking a paint color. Greedy always grabs the same "safe" blue. Temperature widens your color range — cranked up, you might grab wild purples and oranges. Top-p trims the palette to colors that collectively make sense, while top-k limits you to a fixed number of choices. The right strategy depends on whether you want a reliable blueprint or a creative painting.' },
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
