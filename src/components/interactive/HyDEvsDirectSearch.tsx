import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const scenarios = [
  {
    query: 'Why do leaves change color in fall?',
    direct: { embedding: 'Short query → sparse embedding', topScore: 0.71, results: ['Autumn foliage tourism guide', 'Leaf color genetics'], quality: 55 },
    hyde: { hypo: 'Chlorophyll breaks down in autumn, revealing carotenoids and anthocyanins...', topScore: 0.93, results: ['Chlorophyll degradation mechanisms', 'Anthocyanin biosynthesis in deciduous trees'], quality: 92 },
  },
  {
    query: 'How to make sourdough bread',
    direct: { embedding: 'Direct query matches recipes', topScore: 0.88, results: ['Sourdough bread recipe', 'Bread baking tips'], quality: 85 },
    hyde: { hypo: 'To make sourdough, first create a starter with flour and water, ferment 5-7 days...', topScore: 0.91, results: ['Sourdough starter guide', 'Fermentation science in baking'], quality: 90 },
  },
];

export default function HyDEvsDirectSearch() {
  const [scenIdx, setScenIdx] = useState(0);
  const s = scenarios[scenIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>HyDE vs Direct Search</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare direct query embedding vs hypothetical document embedding.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {scenarios.map((_, i) => (
          <button key={i} onClick={() => setScenIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${scenIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: scenIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: scenIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: scenIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Query {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>
        "{s.query}"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #C76B4A30' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Direct Embedding</div>
          <div style={{ fontSize: '0.68rem', color: '#7A8B7C', marginBottom: '0.3rem' }}>{s.direct.embedding}</div>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', marginBottom: '0.2rem' }}>Top results:</div>
          {s.direct.results.map((r, i) => (
            <div key={i} style={{ fontSize: '0.7rem', color: '#5A6B5C', padding: '0.15rem 0', borderLeft: '2px solid #C76B4A40', paddingLeft: '0.35rem', marginBottom: '0.1rem' }}>{r}</div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>Top score: {s.direct.topScore}</span>
            <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{s.direct.quality}%</span>
          </div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #8BA88830' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>HyDE Embedding</div>
          <div style={{ fontSize: '0.68rem', color: '#7A8B7C', marginBottom: '0.3rem', fontStyle: 'italic' }}>"{s.hyde.hypo.slice(0, 60)}..."</div>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', marginBottom: '0.2rem' }}>Top results:</div>
          {s.hyde.results.map((r, i) => (
            <div key={i} style={{ fontSize: '0.7rem', color: '#5A6B5C', padding: '0.15rem 0', borderLeft: '2px solid #8BA88840', paddingLeft: '0.35rem', marginBottom: '0.1rem' }}>{r}</div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
            <span style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>Top score: {s.hyde.topScore}</span>
            <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', fontWeight: 600 }}>{s.hyde.quality}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
