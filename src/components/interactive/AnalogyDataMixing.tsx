import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyDataMixing() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🥗', label: 'Recipe Balance', text: 'Data mixing is like creating a balanced recipe. Too much salt (web text) and not enough pepper (code, math, books) makes a bland model. The proportions matter enormously: Llama used ~67% web, ~15% code, ~5% scientific papers, ~5% books, etc. Small changes in the mix — upsampling code from 10% to 15% — can dramatically improve coding ability while barely affecting other skills.' },
    { emoji: '🎵', label: 'DJ Mixing', text: 'A DJ blends multiple tracks to create the perfect set. Data mixing blends domains (web, books, code, conversations, math) at carefully chosen ratios. The mix changes over time too — like a DJ reading the room. Some teams anneal the data mix during training, shifting toward higher-quality sources in later stages. The optimal mix is one of the most closely guarded secrets in LLM training.' },
    { emoji: '🏋️', label: 'Training Regimen', text: 'An athlete balances cardio, strength, flexibility, and sport-specific drills. Data mixing is the model\'s training regimen: enough web text for general language (cardio), code for reasoning (strength), books for long-form coherence (flexibility), and math for logical precision (sport-specific). Overtraining on one domain creates imbalance, just like only lifting weights and never stretching.' },
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
