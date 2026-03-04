import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const queries = [
  {
    q: 'machine learning algorithms',
    results: [
      { dim: 1536, docs: ['ML fundamentals (0.95)', 'Neural networks overview (0.91)', 'Decision tree guide (0.88)'] },
      { dim: 768, docs: ['ML fundamentals (0.94)', 'Neural networks overview (0.90)', 'Decision tree guide (0.86)'] },
      { dim: 384, docs: ['ML fundamentals (0.92)', 'Neural networks overview (0.87)', 'Statistical methods (0.84)'] },
      { dim: 192, docs: ['ML fundamentals (0.88)', 'Data science intro (0.82)', 'Statistics guide (0.79)'] },
    ],
  },
  {
    q: 'quantum entanglement experiments',
    results: [
      { dim: 1536, docs: ['Bell test experiments (0.96)', 'Quantum entanglement theory (0.93)', 'EPR paradox (0.90)'] },
      { dim: 768, docs: ['Bell test experiments (0.95)', 'Quantum entanglement theory (0.92)', 'EPR paradox (0.88)'] },
      { dim: 384, docs: ['Bell test experiments (0.91)', 'Quantum mechanics intro (0.85)', 'EPR paradox (0.83)'] },
      { dim: 192, docs: ['Quantum mechanics intro (0.80)', 'Physics experiments (0.76)', 'Wave functions (0.72)'] },
    ],
  },
];

export default function DimensionTruncationDemo() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [dimLevel, setDimLevel] = useState(0);
  const q = queries[queryIdx];
  const r = q.results[dimLevel];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Dimension Truncation Effects</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how truncating embedding dimensions affects retrieval results.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {queries.map((qq, i) => (
          <button key={i} onClick={() => { setQueryIdx(i); setDimLevel(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${queryIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: queryIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: queryIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: queryIdx === i ? 600 : 400, fontSize: '0.72rem', cursor: 'pointer',
          }}>Query {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>
        "{q.q}"
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Dimensions: {r.dim}</label>
        <input type="range" min={0} max={q.results.length - 1} value={dimLevel} onChange={e => setDimLevel(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#7A8B7C' }}>
          {q.results.map(rr => <span key={rr.dim}>{rr.dim}d</span>)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {r.docs.map((doc, i) => (
          <div key={i} style={{ padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: '#F0EBE1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>#{i + 1}</span>
            <span style={{ fontSize: '0.75rem', color: '#5A6B5C', flex: 1, marginLeft: '0.5rem' }}>{doc}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        {dimLevel === 0 ? 'Full dimensions: best quality retrieval.' : dimLevel === q.results.length - 1 ? 'Heavy truncation: noticeable quality drop, but 8x faster search and 87% less storage.' : `${r.dim} dims: minor quality impact with ${Math.round((1 - r.dim / q.results[0].dim) * 100)}% storage savings.`}
      </div>
    </div>
  );
}
