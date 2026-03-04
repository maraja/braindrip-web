import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyFullVsPEFT() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏠', label: 'Renovation', text: 'Full fine-tuning is gutting and rebuilding an entire house (updating all parameters). PEFT is redecorating — painting walls, changing curtains, adding furniture (updating only a few parameters). The house structure (pre-trained weights) stays intact. PEFT achieves 90-99% of full fine-tuning quality while training only 0.1-1% of parameters, making it feasible on consumer hardware.' },
    { emoji: '👔', label: 'Wardrobe', text: 'Full fine-tuning is getting an entirely new wardrobe (expensive, time-consuming). PEFT is adding strategic accessories — a scarf, tie, or watch — to transform the same outfit for different occasions. Each accessory (adapter) is tiny compared to the wardrobe (model), but changes the overall impression dramatically. You can swap accessories for different events (tasks) while keeping the same core wardrobe.' },
    { emoji: '🎸', label: 'Guitar Pedals', text: 'Full fine-tuning is buying a new guitar for each music genre. PEFT is using effects pedals: plug in a distortion pedal for rock, a reverb pedal for ambient, a clean boost for jazz. The guitar (base model) stays the same; small, cheap pedals (adapters) transform its sound. You can chain pedals (merge adapters) or swap them instantly, enabling one instrument to play any genre.' },
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
