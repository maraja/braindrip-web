import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const concepts = [
  { name: 'Truthfulness', vector: [0.3, -0.1, 0.8, 0.2, -0.4], before: 'The moon is made of cheese and orbits Earth every 24 hours.', after: 'The moon is made of rock and orbits Earth approximately every 27.3 days.' },
  { name: 'Formality', vector: [0.1, 0.6, -0.2, 0.5, 0.3], before: "Hey! That's pretty cool stuff, tbh.", after: 'That is a noteworthy and commendable achievement.' },
  { name: 'Confidence', vector: [-0.2, 0.4, 0.1, 0.7, -0.1], before: 'I think maybe the answer could possibly be 42.', after: 'The answer is 42.' },
];

export default function RepresentationVectorViz() {
  const [conceptIdx, setConceptIdx] = useState(0);
  const [strength, setStrength] = useState(1.0);
  const c = concepts[conceptIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Representation Vectors</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how adding concept vectors to activations changes model behavior.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {concepts.map((cc, i) => (
          <button key={cc.name} onClick={() => setConceptIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${conceptIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: conceptIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: conceptIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: conceptIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{cc.name}</button>
        ))}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Vector strength: {strength.toFixed(1)}x</label>
        <input type="range" min={0} max={2} step={0.1} value={strength} onChange={e => setStrength(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {c.vector.map((v, i) => (
          <div key={i} style={{ textAlign: 'center', width: '40px' }}>
            <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{
                width: '24px', borderRadius: '3px 3px 0 0',
                height: `${Math.abs(v * strength) * 40}px`,
                background: v * strength >= 0 ? '#8BA888' : '#C76B4A',
                opacity: 0.3 + strength * 0.35,
                transform: v * strength < 0 ? 'scaleY(-1) translateY(-100%)' : 'none',
              }} />
            </div>
            <div style={{ fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace", color: '#7A8B7C', marginTop: '0.1rem' }}>{(v * strength).toFixed(1)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#F0EBE1' }}>
          <div style={{ fontSize: '0.6rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>Without vector (baseline)</div>
          <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.5 }}>{c.before}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(139,168,136,0.08)', border: '1px solid #8BA888' }}>
          <div style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>With +{c.name} vector ({strength.toFixed(1)}x)</div>
          <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.5, opacity: 0.3 + strength * 0.35 }}>{c.after}</div>
        </div>
      </div>
    </div>
  );
}
