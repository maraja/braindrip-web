import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const models = [
  { name: 'Base-7B', specialty: 'General', coding: 40, reasoning: 50, creative: 45, chat: 55 },
  { name: 'Code-7B', specialty: 'Coding', coding: 90, reasoning: 55, creative: 30, chat: 40 },
  { name: 'Math-7B', specialty: 'Reasoning', coding: 35, reasoning: 92, creative: 25, chat: 35 },
  { name: 'Story-7B', specialty: 'Creative', coding: 20, reasoning: 30, creative: 95, chat: 70 },
];

export default function MergeRecipeBuilder() {
  const [weights, setWeights] = useState([0.4, 0.3, 0.2, 0.1]);

  const updateWeight = (idx: number, val: number) => {
    const newW = [...weights];
    newW[idx] = val;
    const total = newW.reduce((a, b) => a + b, 0);
    if (total > 0) {
      const normalized = newW.map(w => Math.round((w / total) * 100) / 100);
      setWeights(normalized);
    }
  };

  const merged = {
    coding: Math.round(models.reduce((s, m, i) => s + m.coding * weights[i], 0)),
    reasoning: Math.round(models.reduce((s, m, i) => s + m.reasoning * weights[i], 0)),
    creative: Math.round(models.reduce((s, m, i) => s + m.creative * weights[i], 0)),
    chat: Math.round(models.reduce((s, m, i) => s + m.chat * weights[i], 0)),
  };

  const skills = [
    { label: 'Coding', value: merged.coding, color: '#C76B4A' },
    { label: 'Reasoning', value: merged.reasoning, color: '#D4A843' },
    { label: 'Creative', value: merged.creative, color: '#8BA888' },
    { label: 'Chat', value: merged.chat, color: '#6E8B6B' },
  ];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Merge Recipe Builder</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Adjust model weights and see predicted merged capabilities.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {models.map((m, i) => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D', width: '70px', flexShrink: 0 }}>{m.name}</span>
            <input type="range" min={0} max={100} value={Math.round(weights[i] * 100)} onChange={e => updateWeight(i, +e.target.value / 100)}
              style={{ flex: 1, accentColor: '#C76B4A' }} />
            <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', width: '35px', textAlign: 'right' }}>{(weights[i] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.6rem' }}>Merged Model Capabilities</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {skills.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ width: '28px', height: `${s.value * 0.6}px`, background: s.color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 700, marginTop: '0.2rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
