import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const iterations = [
  { query: 'What caused the 2008 financial crisis?', action: 'Retrieve', docs: 'Found: housing bubble article (relevance: 0.72)', eval: 'Partial — mentions housing but not derivatives', decision: 'Re-query for more depth' },
  { query: 'Role of mortgage-backed securities in 2008 crisis', action: 'Retrieve', docs: 'Found: MBS and CDO article (relevance: 0.91)', eval: 'Good — explains derivatives and risk', decision: 'Need one more angle: regulatory failure' },
  { query: '2008 crisis regulatory failures deregulation', action: 'Retrieve', docs: 'Found: Glass-Steagall repeal article (relevance: 0.88)', eval: 'Sufficient coverage across all aspects', decision: 'Ready to synthesize answer' },
  { query: 'Synthesizing final answer', action: 'Generate', docs: 'Using 3 retrieved documents', eval: 'Comprehensive answer covering housing, derivatives, regulation', decision: 'Answer complete' },
];

export default function AgenticRAGViz() {
  const [step, setStep] = useState(0);
  const iter = iterations[step];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Agentic RAG Loop</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>The agent iteratively retrieves, evaluates relevance, and decides to re-query or answer.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {iterations.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <div onClick={() => setStep(i)} style={{
              width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= step ? '#C76B4A' : '#E5DFD3', color: i <= step ? '#fff' : '#7A8B7C',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
            }}>{i + 1}</div>
            {i < iterations.length - 1 && <div style={{ width: '20px', height: '2px', background: i < step ? '#C76B4A' : '#E5DFD3' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {[
          { label: 'Query', value: iter.query, color: '#2C3E2D' },
          { label: 'Action', value: iter.action, color: '#C76B4A' },
          { label: 'Retrieved', value: iter.docs, color: '#8BA888' },
          { label: 'Evaluation', value: iter.eval, color: '#D4A843' },
          { label: 'Decision', value: iter.decision, color: '#6E8B6B' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.4rem 0.65rem', background: '#F0EBE1', borderRadius: '6px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.6rem', color: item.color, fontWeight: 700, textTransform: 'uppercase' as const, minWidth: '55px', paddingTop: '0.1rem' }}>{item.label}</span>
            <span style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.4 }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <button onClick={() => setStep(Math.min(iterations.length - 1, step + 1))} disabled={step >= iterations.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step >= iterations.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: step >= iterations.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
