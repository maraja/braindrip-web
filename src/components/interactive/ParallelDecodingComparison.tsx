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
  {
    name: 'Medusa',
    color: '#C76B4A',
    speedup: '2.2-3.6x',
    overhead: '~5% params',
    quality: 'Lossless',
    mechanism: 'Extra prediction heads',
    desc: 'Adds lightweight MLP heads on top of the last hidden state. Each head independently predicts tokens at positions t+2, t+3, etc. A tree-based attention mechanism verifies candidates against the base model.',
    layers: ['Transformer Backbone', 'Hidden States', 'LM Head (t+1)', 'Medusa Head 1 (t+2)', 'Medusa Head 2 (t+3)', 'Medusa Head 3 (t+4)'],
    layerColors: ['#EDE9DF', '#EDE9DF', '#2C3E2D', '#C76B4A', '#C76B4A', '#C76B4A'],
  },
  {
    name: 'Lookahead',
    color: '#D4A843',
    speedup: '1.5-2.3x',
    overhead: '0% params',
    quality: 'Lossless',
    mechanism: 'Jacobi iteration',
    desc: 'Uses Jacobi fixed-point iteration to solve the autoregressive equations in parallel. Maintains n-gram pools from previous iterations. No additional parameters needed -- works with any model out of the box.',
    layers: ['Transformer (Shared)', 'Jacobi Iteration 1', 'Jacobi Iteration 2', 'Jacobi Iteration 3', 'N-gram Pool', 'Verification'],
    layerColors: ['#EDE9DF', '#D4A843', '#D4A843', '#D4A843', '#8BA888', '#2C3E2D'],
  },
  {
    name: 'EAGLE',
    color: '#8BA888',
    speedup: '2.8-3.8x',
    overhead: '~2% params',
    quality: 'Lossless',
    mechanism: 'Feature-level draft',
    desc: 'Trains a lightweight draft model that operates on the feature (hidden state) level rather than token level. Reuses the base model\'s representations for more accurate speculation, enabling higher acceptance rates.',
    layers: ['Transformer Backbone', 'Hidden States (reused)', 'Lightweight Draft Net', 'Feature-Level Prediction', 'Tree Draft', 'Verification via Base'],
    layerColors: ['#EDE9DF', '#EDE9DF', '#8BA888', '#8BA888', '#8BA888', '#2C3E2D'],
  },
];

export default function ParallelDecodingComparison() {
  const [selected, setSelected] = useState(0);
  const m = methods[selected];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Parallel Decoding Methods
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {methods.map((mt, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: selected === i ? `2px solid ${mt.color}` : '1px solid #E5DFD3', background: selected === i ? `${mt.color}10` : 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: selected === i ? 700 : 400, fontSize: '0.9rem', color: '#2C3E2D', transition: 'all 0.2s' }}>
            {mt.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontSize: '0.82rem', color: '#7A6F5E', lineHeight: 1.6, marginBottom: '1rem' }}>{m.desc}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[{ label: 'Speedup', value: m.speedup }, { label: 'Overhead', value: m.overhead }, { label: 'Quality', value: m.quality }, { label: 'Mechanism', value: m.mechanism }].map((item, i) => (
              <div key={i} style={{ padding: '0.6rem', background: 'rgba(237,233,223,0.5)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.65rem', color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{item.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 600, color: m.color, marginTop: '0.2rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Architecture</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {m.layers.map((layer, i) => (
              <div key={i} style={{ padding: '0.45rem 0.75rem', borderRadius: '7px', background: m.layerColors[i] === '#EDE9DF' ? '#EDE9DF' : `${m.layerColors[i]}18`, border: `1px solid ${m.layerColors[i] === '#EDE9DF' ? '#E5DFD3' : m.layerColors[i]}40`, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", color: m.layerColors[i] === '#EDE9DF' ? '#7A6F5E' : m.layerColors[i], fontWeight: m.layerColors[i] === '#EDE9DF' ? 400 : 600 }}>
                {layer}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.8rem 1rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', border: '1px solid rgba(139,168,136,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
          {methods.map((mt, i) => (
            <div key={i} style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '0.65rem', color: '#7A6F5E' }}>{mt.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: mt.color }}>{mt.speedup}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: '0.65rem', color: '#7A6F5E' }}>Autoregressive</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#7A6F5E' }}>1.0x</div>
          </div>
        </div>
      </div>
    </div>
  );
}
