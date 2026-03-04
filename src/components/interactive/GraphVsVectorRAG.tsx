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
    q: 'What are the connections between Company A and Company B through their board members?',
    type: 'Multi-hop relationship',
    vector: { answer: 'Company A and Company B are both tech firms...', quality: 30, issue: 'Cannot trace multi-hop relationships' },
    graph: { answer: 'Company A director John Smith also sits on Company B board. Both connected to VC firm X through...', quality: 92, issue: 'Traverses relationship graph effectively' },
  },
  {
    q: 'What are the main themes in this 500-page research corpus?',
    type: 'Global summarization',
    vector: { answer: 'The research discusses various topics including...', quality: 35, issue: 'Only sees individual chunks, misses big picture' },
    graph: { answer: 'Six major themes emerge: (1) Neural architecture advances, (2) Scaling laws, (3) Safety concerns...', quality: 90, issue: 'Community summaries capture global themes' },
  },
  {
    q: 'When was the Eiffel Tower built?',
    type: 'Simple factual',
    vector: { answer: 'The Eiffel Tower was completed in 1889.', quality: 95, issue: 'Direct match, works perfectly' },
    graph: { answer: 'The Eiffel Tower was completed in 1889 for the World Fair.', quality: 90, issue: 'Works but overkill for simple queries' },
  },
];

export default function GraphVsVectorRAG() {
  const [queryIdx, setQueryIdx] = useState(0);
  const q = queries[queryIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Graph RAG vs Vector RAG</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare graph-based vs vector-based retrieval on different query types.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {queries.map((qq, i) => (
          <button key={i} onClick={() => setQueryIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${queryIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: queryIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: queryIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: queryIdx === i ? 600 : 400, fontSize: '0.72rem', cursor: 'pointer',
          }}>{qq.type}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        {q.q}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Vector RAG', data: q.vector, color: '#C76B4A' },
          { label: 'Graph RAG', data: q.graph, color: '#8BA888' },
        ].map(m => (
          <div key={m.label} style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${m.color}30` }}>
            <div style={{ fontSize: '0.65rem', color: m.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>{m.label}</div>
            <div style={{ fontSize: '0.75rem', color: '#5A6B5C', lineHeight: 1.5, marginBottom: '0.4rem' }}>{m.data.answer}</div>
            <div style={{ background: '#E5DFD3', borderRadius: '4px', height: '10px', overflow: 'hidden', marginBottom: '0.2rem' }}>
              <div style={{ width: `${m.data.quality}%`, height: '100%', background: m.color, borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.62rem', color: '#7A8B7C', fontStyle: 'italic' }}>{m.data.issue}</span>
              <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: m.color, fontWeight: 600 }}>{m.data.quality}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
