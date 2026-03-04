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
    q: 'Who received the Nobel Prize?',
    earlyResults: [
      { chunk: 'He received the Nobel Prize in 1921.', score: 0.72, issue: '"He" = who? Lost context.' },
      { chunk: 'His work revolutionized physics.', score: 0.35, issue: '"His" = unknown referent.' },
    ],
    lateResults: [
      { chunk: 'Einstein received the Nobel Prize in 1921.', score: 0.96, issue: 'Full context preserved — knows "He" = Einstein' },
      { chunk: 'Einstein\'s work revolutionized physics.', score: 0.68, issue: 'Cross-chunk context retained.' },
    ],
  },
  {
    q: 'What is the connection between Ulm and physics?',
    earlyResults: [
      { chunk: 'Born in Ulm, Germany.', score: 0.55, issue: 'Mentions Ulm but no physics connection.' },
      { chunk: 'Revolutionized modern physics.', score: 0.48, issue: 'Mentions physics but no Ulm.' },
    ],
    lateResults: [
      { chunk: 'Einstein born in Ulm → developed relativity', score: 0.91, issue: 'Embedding captures document-level theme.' },
      { chunk: 'Einstein revolutionized modern physics.', score: 0.82, issue: 'Linked to Ulm via shared context.' },
    ],
  },
];

export default function LateVsEarlyChunking() {
  const [queryIdx, setQueryIdx] = useState(0);
  const q = queries[queryIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Early vs Late Chunking</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare how context loss in early chunking vs context preservation in late chunking affects retrieval.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {queries.map((_, i) => (
          <button key={i} onClick={() => setQueryIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${queryIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: queryIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: queryIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: queryIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Query {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        "{q.q}"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Early Chunking', results: q.earlyResults, color: '#C76B4A' },
          { label: 'Late Chunking', results: q.lateResults, color: '#8BA888' },
        ].map(method => (
          <div key={method.label} style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${method.color}30` }}>
            <div style={{ fontSize: '0.65rem', color: method.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>{method.label}</div>
            {method.results.map((r, i) => (
              <div key={i} style={{ marginBottom: '0.4rem', padding: '0.35rem', background: '#F0EBE1', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.72rem', color: '#2C3E2D', marginBottom: '0.15rem' }}>{r.chunk}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6rem', color: '#7A8B7C', fontStyle: 'italic' }}>{r.issue}</span>
                  <span style={{ fontSize: '0.62rem', fontFamily: "'JetBrains Mono', monospace", color: method.color, fontWeight: 600 }}>{r.score.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
