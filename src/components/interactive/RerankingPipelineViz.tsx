import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const initialDocs = [
  { title: 'Doc A: Python basics tutorial', biScore: 0.85, crossScore: 0.45 },
  { title: 'Doc B: Advanced Python decorators', biScore: 0.82, crossScore: 0.92 },
  { title: 'Doc C: Python vs Java comparison', biScore: 0.78, crossScore: 0.38 },
  { title: 'Doc D: Python decorator patterns in production', biScore: 0.76, crossScore: 0.88 },
  { title: 'Doc E: JavaScript decorators proposal', biScore: 0.71, crossScore: 0.12 },
];

export default function RerankingPipelineViz() {
  const [stage, setStage] = useState<'retrieve' | 'rerank'>('retrieve');
  const query = 'How do Python decorators work?';
  const docs = stage === 'retrieve'
    ? [...initialDocs].sort((a, b) => b.biScore - a.biScore)
    : [...initialDocs].sort((a, b) => b.crossScore - a.crossScore);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Reranking Pipeline</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Stage 1: Fast bi-encoder retrieval. Stage 2: Precise cross-encoder reranking.</p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>
        Q: "{query}"
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['retrieve', 'rerank'] as const).map(s => (
          <button key={s} onClick={() => setStage(s)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${stage === s ? '#C76B4A' : '#E5DFD3'}`,
            background: stage === s ? 'rgba(199,107,74,0.08)' : 'transparent', color: stage === s ? '#C76B4A' : '#5A6B5C',
            fontWeight: stage === s ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{s === 'retrieve' ? 'Stage 1: Bi-Encoder' : 'Stage 2: Cross-Encoder'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {docs.map((d, i) => {
          const score = stage === 'retrieve' ? d.biScore : d.crossScore;
          const isRelevant = d.title.toLowerCase().includes('decorator');
          return (
            <div key={d.title} style={{
              padding: '0.45rem 0.65rem', borderRadius: '6px',
              border: `1px solid ${isRelevant ? '#8BA888' : '#E5DFD3'}`,
              background: isRelevant ? 'rgba(139,168,136,0.05)' : 'transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#7A8B7C', width: '16px' }}>#{i + 1}</span>
                <span style={{ fontSize: '0.75rem', color: '#2C3E2D' }}>{d.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: '50px', background: '#E5DFD3', borderRadius: '3px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${score * 100}%`, height: '100%', background: isRelevant ? '#8BA888' : '#C76B4A', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: isRelevant ? '#8BA888' : '#C76B4A', fontWeight: 600, width: '30px' }}>{score.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        {stage === 'retrieve' ? 'Bi-encoder is fast (independent encoding) but may rank irrelevant docs high due to keyword overlap.' : 'Cross-encoder jointly processes query+doc, understanding semantic relevance — decorator docs now rank highest.'}
      </div>
    </div>
  );
}
