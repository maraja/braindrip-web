import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const contexts = [
  { len: '4K', memory: 0.5, speed: 100, quality: 95, kvCache: '0.5 GB', cost: '$0.01' },
  { len: '16K', memory: 2, speed: 85, quality: 93, kvCache: '2 GB', cost: '$0.04' },
  { len: '32K', memory: 4, speed: 72, quality: 90, kvCache: '4 GB', cost: '$0.08' },
  { len: '128K', memory: 16, speed: 45, quality: 82, kvCache: '16 GB', cost: '$0.32' },
  { len: '1M', memory: 128, speed: 15, quality: 68, kvCache: '128 GB', cost: '$2.56' },
];

export default function ContextLengthImpact() {
  const [ctxIdx, setCtxIdx] = useState(2);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Context Length Impact</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how extending context affects memory, speed, quality, and cost.</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Context window: {contexts[ctxIdx].len} tokens</label>
        <input type="range" min={0} max={contexts.length - 1} value={ctxIdx} onChange={e => setCtxIdx(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#7A8B7C' }}>
          {contexts.map(c => <span key={c.len}>{c.len}</span>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Inference Speed', value: contexts[ctxIdx].speed, suffix: '%', color: contexts[ctxIdx].speed > 70 ? '#8BA888' : contexts[ctxIdx].speed > 40 ? '#D4A843' : '#C76B4A' },
          { label: 'Quality (Needle-in-Haystack)', value: contexts[ctxIdx].quality, suffix: '%', color: contexts[ctxIdx].quality > 85 ? '#8BA888' : contexts[ctxIdx].quality > 70 ? '#D4A843' : '#C76B4A' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>{item.label}</div>
            <div style={{ background: '#E5DFD3', borderRadius: '4px', height: '12px', overflow: 'hidden', marginBottom: '0.2rem' }}>
              <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: item.color, fontWeight: 600 }}>{item.value}{item.suffix}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'KV Cache', value: contexts[ctxIdx].kvCache },
          { label: 'Memory', value: `${contexts[ctxIdx].memory} GB` },
          { label: 'Cost/Query', value: contexts[ctxIdx].cost },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#2C3E2D' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
