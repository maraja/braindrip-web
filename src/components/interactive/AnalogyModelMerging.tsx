import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyModelMerging() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🍹', label: 'Cocktail Mixing', text: 'A bartender combines different spirits to create a cocktail with properties none had alone. Model merging blends the weights of multiple fine-tuned models: one good at coding, one at math, one at creative writing. Techniques like SLERP, TIES, and DARE average or interpolate weights. The result: a single model that inherits capabilities from all "ingredients" without any additional training.' },
    { emoji: '🧬', label: 'Crossbreeding', text: 'Crossbreeding combines traits from different parent organisms. Model merging combines capabilities from different fine-tuned models by mathematically combining their weights. Task arithmetic subtracts the base model weights to isolate "task vectors" (the learned specialization), then adds them together. The merged model can do coding AND creative writing AND math, even though no single training run taught all three.' },
    { emoji: '🗺️', label: 'Map Overlay', text: 'Overlaying a topographic map, a road map, and a satellite image creates a richer combined view. Model merging overlays the "knowledge maps" of different specialized models. Since fine-tuned models share the same base architecture, their weight spaces are compatible enough for interpolation. The open-source community uses this extensively — merging specialist models to create generalists that rival expensive training runs.' },
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
