import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const methods = [
  { name: 'YaRN', full: 'Yet another RoPE extensioN', approach: 'Modifies RoPE frequencies with a ramp function — high-freq dimensions unchanged, low-freq scaled', maxCtx: '128K', quality: 88, training: 'Few % of original', complexity: 'Low' },
  { name: 'LongRoPE', full: 'Long Range RoPE', approach: 'Uses evolutionary search to find optimal per-dimension rescale factors for RoPE', maxCtx: '2M+', quality: 92, training: '1000 steps', complexity: 'Medium' },
  { name: 'Ring Attention', full: 'Ring Attention', approach: 'Distributes sequence across devices in a ring, each computes local attention and passes KV blocks', maxCtx: '1M+', quality: 95, training: 'Full training', complexity: 'High' },
];

export default function ContextExtensionMethods() {
  const [methodIdx, setMethodIdx] = useState(0);
  const m = methods[methodIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Context Window Extension Methods</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare approaches for extending transformer context windows beyond training length.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {methods.map((mm, i) => (
          <button key={mm.name} onClick={() => setMethodIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${methodIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: methodIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: methodIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: methodIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{mm.name}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{m.full}</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', marginTop: '0.3rem', lineHeight: 1.5 }}>{m.approach}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'Max Context', value: m.maxCtx, color: '#C76B4A' },
          { label: 'Quality', value: `${m.quality}%`, color: '#8BA888' },
          { label: 'Training Cost', value: m.training, color: '#D4A843' },
          { label: 'Complexity', value: m.complexity, color: '#5A6B5C' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono', monospace", marginTop: '0.15rem' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.3rem' }}>Quality Retention</div>
        <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '16px', overflow: 'hidden' }}>
          <div style={{ width: `${m.quality}%`, height: '100%', background: m.quality > 90 ? '#8BA888' : '#D4A843', borderRadius: '6px', transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}
