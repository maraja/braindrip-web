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
    q: 'What is the main theme of the document?',
    path: [
      { level: 'Level 2 (Root)', node: 'Meta-Summary', score: 0.95, action: 'High relevance at top level — answer from here' },
    ],
    answer: 'Answered from top-level summary — no need to go deeper.',
  },
  {
    q: 'How does gradient descent work specifically?',
    path: [
      { level: 'Level 2 (Root)', node: 'Meta-Summary', score: 0.60, action: 'Partial match — need more detail, go deeper' },
      { level: 'Level 1 (Cluster)', node: 'Optimization Techniques', score: 0.88, action: 'Good cluster match — check leaf nodes' },
      { level: 'Level 0 (Leaf)', node: 'Chunk 3: Gradient Descent', score: 0.96, action: 'Exact match — use this chunk' },
    ],
    answer: 'Traversed from root to specific leaf chunk for detailed answer.',
  },
  {
    q: 'Compare training techniques across the document',
    path: [
      { level: 'Level 2 (Root)', node: 'Meta-Summary', score: 0.72, action: 'Partial — need cluster-level detail' },
      { level: 'Level 1 (Cluster)', node: 'Core ML Training', score: 0.91, action: 'Strong match at cluster level' },
      { level: 'Level 1 (Cluster)', node: 'Optimization Techniques', score: 0.85, action: 'Also relevant — combine both clusters' },
    ],
    answer: 'Used two cluster-level summaries for a comparative answer.',
  },
];

export default function TreeTraversalDemo() {
  const [queryIdx, setQueryIdx] = useState(1);
  const [step, setStep] = useState(0);
  const q = queries[queryIdx];
  const maxStep = q.path.length - 1;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>RAPTOR Tree Traversal</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how queries traverse the RAPTOR tree to find the right abstraction level.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {queries.map((qq, i) => (
          <button key={i} onClick={() => { setQueryIdx(i); setStep(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${queryIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: queryIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: queryIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: queryIdx === i ? 600 : 400, fontSize: '0.72rem', cursor: 'pointer',
          }}>Q{i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        {q.q}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
        {q.path.slice(0, step + 1).map((p, i) => (
          <div key={i} style={{
            padding: '0.5rem 0.65rem', borderRadius: '6px', borderLeft: `3px solid ${i === step ? '#C76B4A' : '#8BA888'}`,
            background: i === step ? 'rgba(199,107,74,0.06)' : '#F0EBE1', marginLeft: `${i * 1}rem`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D' }}>{p.level}: {p.node}</span>
              <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: p.score > 0.8 ? '#8BA888' : '#D4A843' }}>score: {p.score.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#5A6B5C', marginTop: '0.15rem' }}>{p.action}</div>
          </div>
        ))}
      </div>

      {step >= maxStep && (
        <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(139,168,136,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#8BA888', fontWeight: 500, marginBottom: '0.5rem' }}>
          {q.answer}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Up</button>
        <button onClick={() => setStep(Math.min(maxStep, step + 1))} disabled={step >= maxStep} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step >= maxStep ? '#D4C5A9' : '#5A6B5C', cursor: step >= maxStep ? 'default' : 'pointer', fontSize: '0.78rem' }}>Deeper →</button>
      </div>
    </div>
  );
}
