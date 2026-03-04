import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const pipeline = [
  { name: 'Router', desc: 'Classifies query type and routes to appropriate pipeline', icon: '🔀', output: 'query_type: factual', status: 'done' },
  { name: 'Retriever', desc: 'Fetches relevant documents from vector store', icon: '🔍', output: '3 chunks retrieved (scores: 0.92, 0.87, 0.81)', status: 'done' },
  { name: 'Generator', desc: 'LLM generates answer using retrieved context', icon: '🧠', output: 'Draft answer: "The capital of France is Paris..."', status: 'done' },
  { name: 'Verifier', desc: 'Checks answer against retrieved facts for hallucination', icon: '✓', output: 'Verification: PASS (all claims supported)', status: 'done' },
  { name: 'Guardrails', desc: 'Checks for safety, format compliance, PII', icon: '🛡️', output: 'Safety: PASS, Format: PASS', status: 'done' },
];

export default function CompoundSystemViz() {
  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Compound AI System Pipeline</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Trace a query through a multi-component AI system.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
        {pipeline.map((step, i) => (
          <div key={step.name} onClick={() => setActiveStep(i)} style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
            border: `1px solid ${activeStep === i ? '#C76B4A' : '#E5DFD3'}`,
            background: i <= activeStep ? (activeStep === i ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.04)') : 'transparent',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1rem' }}>{step.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D' }}>{step.name}</div>
              {activeStep === i && showDetails && (
                <>
                  <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.2rem' }}>{step.desc}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#8BA888', marginTop: '0.2rem', background: '#F0EBE1', padding: '0.25rem 0.4rem', borderRadius: '4px' }}>{step.output}</div>
                </>
              )}
            </div>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: i <= activeStep ? '#8BA888' : '#E5DFD3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff' }}>
              {i <= activeStep ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setShowDetails(!showDetails)} style={{
          padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent',
          fontSize: '0.72rem', color: '#5A6B5C', cursor: 'pointer',
        }}>{showDetails ? 'Hide Details' : 'Show Details'}</button>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep === 0 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep === 0 ? 'default' : 'pointer', fontSize: '0.72rem' }}>← Prev</button>
          <button onClick={() => setActiveStep(Math.min(pipeline.length - 1, activeStep + 1))} disabled={activeStep >= pipeline.length - 1} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep >= pipeline.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep >= pipeline.length - 1 ? 'default' : 'pointer', fontSize: '0.72rem' }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
