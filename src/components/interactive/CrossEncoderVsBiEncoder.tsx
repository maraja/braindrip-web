import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const dims = [
  { label: 'Accuracy', bi: 72, cross: 95, biNote: 'Independent encoding loses interactions', crossNote: 'Joint attention captures deep relevance' },
  { label: 'Speed (1K docs)', bi: 95, cross: 15, biNote: 'Pre-compute doc embeddings, just dot product', crossNote: 'Must run model for each query-doc pair' },
  { label: 'Scalability', bi: 95, cross: 10, biNote: 'Scales to billions of documents', crossNote: 'O(n) model calls per query' },
  { label: 'Offline Indexing', bi: 95, cross: 5, biNote: 'Embed docs once, store vectors', crossNote: 'Cannot pre-compute — needs query' },
  { label: 'Semantic Understanding', bi: 60, cross: 95, biNote: 'Limited to embedding similarity', crossNote: 'Full cross-attention between query and doc' },
];

export default function CrossEncoderVsBiEncoder() {
  const [dimIdx, setDimIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Bi-Encoder vs Cross-Encoder</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare fast approximate bi-encoders with precise cross-encoders.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(199,107,74,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const }}>Bi-Encoder</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#5A6B5C', marginTop: '0.15rem' }}>E(query) · E(doc) → score</div>
        </div>
        <div style={{ padding: '0.5rem', background: 'rgba(139,168,136,0.06)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const }}>Cross-Encoder</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#5A6B5C', marginTop: '0.15rem' }}>BERT([query; doc]) → score</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {dims.map((d, i) => (
          <div key={d.label} onClick={() => setDimIdx(i)} style={{
            padding: '0.45rem 0.65rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${dimIdx === i ? '#D4A843' : '#E5DFD3'}`,
            background: dimIdx === i ? 'rgba(212,168,67,0.04)' : 'transparent',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.25rem' }}>{d.label}</div>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.55rem', color: '#C76B4A', width: '22px' }}>Bi</span>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${d.bi}%`, height: '100%', background: '#C76B4A', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '3px', height: '8px' }}>
                <div style={{ width: `${d.cross}%`, height: '100%', background: '#8BA888', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.55rem', color: '#8BA888', width: '22px', textAlign: 'right' }}>CE</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem', background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#C76B4A' }}><strong>Bi:</strong> {dims[dimIdx].biNote}</div>
        <div style={{ fontSize: '0.72rem', color: '#8BA888' }}><strong>CE:</strong> {dims[dimIdx].crossNote}</div>
      </div>
    </div>
  );
}
