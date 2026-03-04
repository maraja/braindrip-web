import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const steps = [
  { name: 'Retrieve', desc: 'Fetch top-k documents from knowledge base', icon: '🔍', output: '3 documents retrieved' },
  { name: 'Evaluate', desc: 'Score each document for relevance to the query', icon: '⚖️', output: 'Doc1: Correct (0.92), Doc2: Ambiguous (0.55), Doc3: Incorrect (0.21)' },
  { name: 'Action', desc: 'Decide action based on relevance scores', icon: '🔀', output: 'Mixed relevance → Correct + Supplement' },
  { name: 'Correct', desc: 'Extract key knowledge from relevant docs, discard noise', icon: '✂️', output: 'Extracted 2 key facts from Doc1, refined Doc2' },
  { name: 'Supplement', desc: 'Web search for additional information to fill gaps', icon: '🌐', output: 'Web search found 2 additional supporting sources' },
  { name: 'Generate', desc: 'Generate answer using corrected and supplemented context', icon: '📝', output: 'Final answer generated with high confidence' },
];

export default function CRAGFlowViz() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>CRAG Flow</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Corrective RAG: retrieve, evaluate, correct/supplement, then generate.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '1rem', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1 }}>
            <button onClick={() => setActiveStep(i)} style={{
              flex: 1, padding: '0.4rem 0.15rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
              border: `1px solid ${activeStep === i ? '#C76B4A' : '#E5DFD3'}`,
              background: i <= activeStep ? (activeStep === i ? 'rgba(199,107,74,0.08)' : 'rgba(139,168,136,0.04)') : '#F0EBE1',
              fontSize: '0.55rem', color: activeStep === i ? '#C76B4A' : '#7A8B7C', fontWeight: activeStep === i ? 600 : 400,
            }}>
              <div style={{ fontSize: '0.85rem' }}>{s.icon}</div>
              <div>{s.name}</div>
            </button>
            {i < steps.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.6rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>{steps[activeStep].desc}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#8BA888', background: 'rgba(139,168,136,0.08)', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
          {steps[activeStep].output}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep === 0 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C', alignSelf: 'center' }}>{activeStep + 1}/{steps.length}</span>
        <button onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep >= steps.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep >= steps.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep >= steps.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
