import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDropoutAndRegularization() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a rowing team where the same four members always row together. They develop compensating habits -- if one pulls too hard left, another adjusts right -- making the team fragile and unable to perform if any member is absent.' },
    { emoji: '⚙️', label: 'How It Works', text: 'During training, for a layer with activation vector h:  [equation] [equation]  where p is the drop probability (typically 0.5 for fully connected layers, 0.1-0.3 for other positions). At test time, no neurons are dropped and no scaling is applied (inverted dropout handles this automatically).' },
    { emoji: '🔍', label: 'In Detail', text: 'Dropout (Srivastava et al., 2014) randomly sets each neuron\'s activation to zero with probability p during training. The surviving activations are scaled by &#123;1&#125;&#123;1-p&#125; (inverted dropout) so that expected values remain unchanged at test time.' },
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
