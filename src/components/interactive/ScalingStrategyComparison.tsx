import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const strategies = [
  { name: 'More Tokens', desc: 'Generate longer reasoning chains', compute: 2, quality: 72, latency: 'Medium', bestFor: 'Step-by-step reasoning', diminishing: 'High' },
  { name: 'Beam Search', desc: 'Explore multiple paths in parallel', compute: 4, quality: 78, latency: 'High', bestFor: 'Translation, code gen', diminishing: 'Medium' },
  { name: 'Best-of-N', desc: 'Sample N completions, pick best via verifier', compute: 8, quality: 85, latency: 'High', bestFor: 'Math, verifiable tasks', diminishing: 'Low' },
  { name: 'Verification', desc: 'Generate answer, then verify and retry if wrong', compute: 3, quality: 82, latency: 'Medium', bestFor: 'Logic, factual queries', diminishing: 'Medium' },
];

export default function ScalingStrategyComparison() {
  const [stratIdx, setStratIdx] = useState(0);
  const [computeMultiplier, setComputeMultiplier] = useState(4);
  const s = strategies[stratIdx];
  const effectiveQuality = Math.min(98, Math.round(s.quality + Math.log2(computeMultiplier) * (s.diminishing === 'Low' ? 5 : s.diminishing === 'Medium' ? 3 : 1.5)));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Inference Scaling Strategies</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare different ways to spend extra compute at inference time.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {strategies.map((ss, i) => (
          <button key={ss.name} onClick={() => setStratIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${stratIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: stratIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: stratIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: stratIdx === i ? 600 : 400, fontSize: '0.75rem', cursor: 'pointer',
          }}>{ss.name}</button>
        ))}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Compute multiplier: {computeMultiplier}x</label>
        <input type="range" min={1} max={32} value={computeMultiplier} onChange={e => setComputeMultiplier(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 500 }}>{s.desc}</div>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', marginTop: '0.2rem' }}>Best for: {s.bestFor}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'Quality @ ' + computeMultiplier + 'x', value: `${effectiveQuality}%`, color: effectiveQuality > 85 ? '#8BA888' : '#D4A843' },
          { label: 'Latency', value: s.latency, color: s.latency === 'High' ? '#C76B4A' : '#D4A843' },
          { label: 'Diminishing Returns', value: s.diminishing, color: s.diminishing === 'Low' ? '#8BA888' : s.diminishing === 'Medium' ? '#D4A843' : '#C76B4A' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: item.color, marginTop: '0.1rem' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
