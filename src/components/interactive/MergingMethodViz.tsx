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
  { name: 'Linear', desc: 'Simple weighted average of model parameters', formula: 'W = α·W_A + (1-α)·W_B', pros: 'Simple, predictable', cons: 'Parameter interference', quality: 65, complexity: 10 },
  { name: 'SLERP', desc: 'Spherical interpolation preserving weight magnitude', formula: 'W = sin((1-t)θ)/sin(θ)·W_A + sin(tθ)/sin(θ)·W_B', pros: 'Preserves norms, smoother', cons: 'Only 2 models at once', quality: 78, complexity: 30 },
  { name: 'TIES', desc: 'Trim, Elect Sign, merge only agreeing deltas', formula: 'Trim small Δ → Elect sign → Disjoint merge', pros: 'Reduces interference', cons: 'Aggressive trimming', quality: 85, complexity: 60 },
  { name: 'DARE', desc: 'Randomly drop deltas, rescale surviving ones', formula: 'Δ\' = mask(Δ, p) / (1-p) then merge', pros: 'Works with many models', cons: 'Stochastic results', quality: 88, complexity: 50 },
];

export default function MergingMethodViz() {
  const [methodIdx, setMethodIdx] = useState(0);
  const m = methods[methodIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Model Merging Methods</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare approaches for combining model weights without retraining.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {methods.map((mm, i) => (
          <button key={mm.name} onClick={() => setMethodIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${methodIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: methodIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: methodIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: methodIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>{mm.name}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 500, marginBottom: '0.35rem' }}>{m.desc}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#C76B4A', background: 'rgba(199,107,74,0.06)', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>{m.formula}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Merge Quality</div>
          <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
            <div style={{ width: `${m.quality}%`, height: '100%', background: '#8BA888', borderRadius: '6px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C', marginTop: '0.15rem', fontFamily: "'JetBrains Mono', monospace" }}>{m.quality}%</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Complexity</div>
          <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '14px', overflow: 'hidden' }}>
            <div style={{ width: `${m.complexity}%`, height: '100%', background: '#D4A843', borderRadius: '6px', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C', marginTop: '0.15rem', fontFamily: "'JetBrains Mono', monospace" }}>{m.complexity}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.5rem 0.65rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const }}>Pros</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{m.pros}</div>
        </div>
        <div style={{ padding: '0.5rem 0.65rem', background: 'rgba(199,107,74,0.05)', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.6rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const }}>Cons</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{m.cons}</div>
        </div>
      </div>
    </div>
  );
}
