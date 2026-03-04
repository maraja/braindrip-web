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
  { name: 'o1', maker: 'OpenAI', approach: 'Hidden CoT with RL-trained reasoning', math: 92, code: 89, logic: 90, speed: 30, thinkTokens: 'Hidden', cost: 'Very High' },
  { name: 'o3', maker: 'OpenAI', approach: 'Extended reasoning with adaptive compute budget', math: 96, code: 93, logic: 94, speed: 20, thinkTokens: 'Hidden, adjustable', cost: 'Very High' },
  { name: 'DeepSeek-R1', maker: 'DeepSeek', approach: 'Open-weight, RL-based reasoning with visible CoT', math: 90, code: 85, logic: 88, speed: 35, thinkTokens: 'Visible', cost: 'Low (open)' },
  { name: 'Claude (extended)', maker: 'Anthropic', approach: 'Extended thinking with visible reasoning traces', math: 88, code: 91, logic: 89, speed: 40, thinkTokens: 'Visible', cost: 'High' },
];

export default function ReasoningModelComparison() {
  const [modelIdx, setModelIdx] = useState(0);
  const m = models[modelIdx];
  const benchmarks = [
    { label: 'Math', value: m.math, color: '#C76B4A' },
    { label: 'Code', value: m.code, color: '#8BA888' },
    { label: 'Logic', value: m.logic, color: '#D4A843' },
    { label: 'Speed', value: m.speed, color: '#6E8B6B' },
  ];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reasoning Model Comparison</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare approaches to reasoning across frontier models.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {models.map((mm, i) => (
          <button key={mm.name} onClick={() => setModelIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${modelIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: modelIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: modelIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: modelIdx === i ? 600 : 400, fontSize: '0.75rem', cursor: 'pointer',
          }}>{mm.name}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{m.maker}</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{m.approach}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', alignItems: 'flex-end', height: '70px' }}>
        {benchmarks.map(b => (
          <div key={b.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: '55px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ width: '28px', height: `${b.value * 0.55}px`, background: b.color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: b.color, fontWeight: 600, marginTop: '0.15rem' }}>{b.value}</div>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C' }}>{b.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ padding: '0.5rem 0.65rem', background: '#F0EBE1', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Thinking Tokens</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', marginTop: '0.15rem' }}>{m.thinkTokens}</div>
        </div>
        <div style={{ padding: '0.5rem 0.65rem', background: '#F0EBE1', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Cost</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', marginTop: '0.15rem' }}>{m.cost}</div>
        </div>
      </div>
    </div>
  );
}
