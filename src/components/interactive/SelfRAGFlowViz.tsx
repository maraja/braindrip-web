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
  { name: 'Input', desc: 'Receive query and decide if retrieval is needed', token: 'Retrieve', tokenValue: 'Yes', tokenColor: '#8BA888' },
  { name: 'Retrieve', desc: 'Fetch relevant passages from knowledge base', token: '', tokenValue: '', tokenColor: '' },
  { name: 'ISREL', desc: 'Is the retrieved passage relevant to the query?', token: 'ISREL', tokenValue: 'Relevant', tokenColor: '#8BA888' },
  { name: 'Generate', desc: 'Generate response segment using the passage', token: '', tokenValue: '', tokenColor: '' },
  { name: 'ISSUP', desc: 'Is the response supported by the retrieved passage?', token: 'ISSUP', tokenValue: 'Fully Supported', tokenColor: '#8BA888' },
  { name: 'ISUSE', desc: 'Is the overall response useful for the query?', token: 'ISUSE', tokenValue: 'Utility: 5', tokenColor: '#8BA888' },
];

export default function SelfRAGFlowViz() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Self-RAG Flow</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Self-RAG uses reflection tokens (ISREL, ISSUP, ISUSE) to self-evaluate.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setActiveStep(i)} style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
            border: `1px solid ${activeStep === i ? '#C76B4A' : '#E5DFD3'}`,
            background: i <= activeStep ? (activeStep === i ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.03)') : 'transparent',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D' }}>{s.name}</div>
              {activeStep === i && <div style={{ fontSize: '0.72rem', color: '#5A6B5C', marginTop: '0.15rem' }}>{s.desc}</div>}
            </div>
            {s.token && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: s.tokenColor + '15', color: s.tokenColor, fontWeight: 700, border: `1px solid ${s.tokenColor}30` }}>
                  [{s.token}]
                </span>
                {i <= activeStep && (
                  <span style={{ fontSize: '0.65rem', color: s.tokenColor, fontWeight: 600 }}>{s.tokenValue}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Reflection Token Summary</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { token: 'Retrieve', desc: 'Decides IF retrieval is needed' },
            { token: 'ISREL', desc: 'Is passage relevant?' },
            { token: 'ISSUP', desc: 'Is response supported?' },
            { token: 'ISUSE', desc: 'Is response useful?' },
          ].map(t => (
            <div key={t.token} style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', background: '#FDFBF7', border: '1px solid #E5DFD3', flex: '1 1 120px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700 }}>[{t.token}]</div>
              <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep === 0 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <button onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep >= steps.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: activeStep >= steps.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: activeStep >= steps.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
