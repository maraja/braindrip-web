import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const TYPES = [
  {
    axis: 'Source',
    categories: [
      { name: 'Intrinsic', desc: 'Contradicts the source material directly', color: '#C76B4A',
        example: 'Source: "The cat sat on the mat." → Model: "The dog sat on the mat."', explanation: 'The model generates output that directly contradicts information present in the input.' },
      { name: 'Extrinsic', desc: 'Adds information not in the source', color: '#D4A843',
        example: 'Source: "The cat sat on the mat." → Model: "The cat sat on the blue mat bought from IKEA."', explanation: 'The model fabricates details that cannot be verified from the source material.' },
    ],
  },
  {
    axis: 'Nature',
    categories: [
      { name: 'Factual', desc: 'Generates false real-world facts', color: '#C76B4A',
        example: '"Albert Einstein invented the telephone in 1876."', explanation: 'The model produces statements that are verifiably false in the real world.' },
      { name: 'Faithful', desc: 'Deviates from provided context', color: '#D4A843',
        example: 'Given a document about climate, the summary introduces unrelated economic claims.', explanation: 'The output is unfaithful to the given context, even if statements might be true in isolation.' },
    ],
  },
];

export default function HallucinationTypeViz() {
  const [axisIdx, setAxisIdx] = useState(0);
  const [catIdx, setCatIdx] = useState(0);
  const axis = TYPES[axisIdx];
  const cat = axis.categories[catIdx];

  const switchAxis = (i: number) => { setAxisIdx(i); setCatIdx(0); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Hallucination Taxonomy</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Classify hallucinations along two axes: source fidelity and factual nature.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {TYPES.map((t, i) => (
          <button key={i} onClick={() => switchAxis(i)} style={{
            padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #E5DFD3', cursor: 'pointer',
            background: axisIdx === i ? '#2C3E2D' : 'transparent', color: axisIdx === i ? '#FDFBF7' : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
          }}>{t.axis} Axis</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {axis.categories.map((c, i) => (
          <button key={i} onClick={() => setCatIdx(i)} style={{
            flex: 1, padding: '0.75rem', borderRadius: '10px', border: `2px solid ${catIdx === i ? c.color : '#E5DFD3'}`,
            background: catIdx === i ? `${c.color}0D` : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ fontWeight: 700, color: c.color, fontSize: '0.92rem' }}>{c.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#5A6B5C', marginTop: '0.2rem' }}>{c.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Example</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>{cat.example}</div>
      </div>

      <div style={{ background: `${cat.color}0A`, border: `1px solid ${cat.color}22`, borderRadius: '10px', padding: '1rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{cat.explanation}</div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {TYPES.flatMap(t => t.categories).map((c, i) => (
          <span key={i} style={{ fontSize: '0.72rem', color: c.color, fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${c.color}15` }}>{c.name}</span>
        ))}
      </div>
    </div>
  );
}
