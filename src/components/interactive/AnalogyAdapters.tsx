import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAdapters() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔌', label: 'Power Adapters', text: 'Travel power adapters let the same device work in different countries. Bottleneck adapters insert small trainable modules (down-project, nonlinearity, up-project) between frozen transformer layers. Prompt tuning prepends learnable "soft prompt" tokens that steer the frozen model. Both approaches keep the base model unchanged while adding minimal trainable parameters for task specialization.' },
    { emoji: '👓', label: 'Prescription Lenses', text: 'Adapters are like prescription lenses you clip over regular glasses. The frames (base model) are shared; each pair of clip-on lenses (adapter) corrects for a different task. Bottleneck adapters add tiny networks inside each layer (only ~3% of parameters). Prompt tuning is even simpler: it learns 10-100 virtual tokens prepended to the input, acting like a "lens" that focuses the model\'s frozen capabilities on a specific task.' },
    { emoji: '🎭', label: 'Theater Masks', text: 'An actor (base model) can play different roles by wearing different masks (adapters). Bottleneck adapters add small neural network "masks" inside each layer. Prefix tuning adds learnable key-value pairs to attention. Prompt tuning learns soft tokens prepended to input. All three approaches freeze the base model and train only the tiny "mask," enabling a single model to serve hundreds of tasks with minimal storage per task.' },
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
