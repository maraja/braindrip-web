import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const metrics = [
  { name: 'Retrieval Quality', dense: 78, colbert: 92, note: 'ColBERT captures fine-grained token matches' },
  { name: 'Index Size', dense: 90, colbert: 30, note: 'ColBERT stores per-token embeddings (much larger)' },
  { name: 'Query Latency', dense: 95, colbert: 65, note: 'Dense uses single dot product; ColBERT does MaxSim' },
  { name: 'Out-of-Domain', dense: 60, colbert: 85, note: 'ColBERT generalizes better to unseen domains' },
  { name: 'Exact Match', dense: 55, colbert: 90, note: 'Token-level matching captures exact phrases' },
];

export default function ColBERTvsDenseRetrieval() {
  const [metricIdx, setMetricIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>ColBERT vs Dense Retrieval</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare late interaction (ColBERT) vs single-vector dense retrieval.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.6rem', background: 'rgba(199,107,74,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const }}>Dense (Bi-Encoder)</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#5A6B5C', marginTop: '0.2rem' }}>Query → [1 vec] · Doc → [1 vec]</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(139,168,136,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const }}>ColBERT (Late Interaction)</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#5A6B5C', marginTop: '0.2rem' }}>Query → [n vecs] MaxSim Doc → [m vecs]</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {metrics.map((m, i) => (
          <div key={m.name} onClick={() => setMetricIdx(i)} style={{
            padding: '0.45rem 0.65rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${metricIdx === i ? '#D4A843' : '#E5DFD3'}`,
            background: metricIdx === i ? 'rgba(212,168,67,0.05)' : 'transparent',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.25rem' }}>{m.name}</div>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.55rem', color: '#C76B4A', width: '32px' }}>Dense</span>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${m.dense}%`, height: '100%', background: '#C76B4A', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', width: '25px' }}>{m.dense}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '0.55rem', color: '#8BA888', width: '32px' }}>ColB</span>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${m.colbert}%`, height: '100%', background: '#8BA888', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', width: '25px' }}>{m.colbert}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#F0EBE1', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        {metrics[metricIdx].note}
      </div>
    </div>
  );
}
