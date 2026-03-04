import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const examples = [
  {
    complex: 'How did COVID-19 affect both the tech industry and the restaurant industry differently?',
    subQueries: [
      { q: 'How did COVID-19 affect the tech industry?', result: 'Remote work surge, cloud computing growth, hiring boom...' },
      { q: 'How did COVID-19 affect the restaurant industry?', result: 'Closures, pivot to delivery, reduced capacity, labor shortages...' },
      { q: 'Key differences between tech and restaurant COVID impacts', result: 'Tech thrived while restaurants struggled; opposite directions...' },
    ],
    merged: 'COVID-19 had divergent effects: tech boomed with remote work while restaurants faced existential threats. Tech saw 30% hiring growth vs 40% restaurant closures.',
  },
  {
    complex: 'Compare the environmental policies of the EU and US in the last 5 years',
    subQueries: [
      { q: 'EU environmental policies 2019-2024', result: 'European Green Deal, carbon border tax, 55% emissions reduction target...' },
      { q: 'US environmental policies 2019-2024', result: 'IRA, Paris Agreement re-entry, EPA regulations...' },
      { q: 'Comparison of EU vs US climate policy approaches', result: 'EU regulatory-first vs US incentive-based approach...' },
    ],
    merged: 'The EU favors regulation (Green Deal, CBAM) while the US relies on incentives (IRA tax credits). Both target net-zero but differ in mechanisms.',
  },
];

export default function QueryDecompViz() {
  const [exIdx, setExIdx] = useState(0);
  const [step, setStep] = useState(0);
  const ex = examples[exIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Query Decomposition</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Complex queries broken into sub-queries, each retrieved separately, results merged.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {examples.map((_, i) => (
          <button key={i} onClick={() => { setExIdx(i); setStep(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${exIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: exIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: exIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: exIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Example {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.15rem' }}>Complex Query</div>
        <div style={{ fontSize: '0.82rem', color: '#2C3E2D' }}>{ex.complex}</div>
      </div>

      {step >= 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
          {ex.subQueries.map((sq, i) => (
            <div key={i} style={{ padding: '0.4rem 0.65rem', borderRadius: '6px', borderLeft: '3px solid #D4A843', background: '#F0EBE1' }}>
              <div style={{ fontSize: '0.72rem', color: '#D4A843', fontWeight: 600 }}>Sub-query {i + 1}: {sq.q}</div>
              {step >= 2 && <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginTop: '0.15rem' }}>Retrieved: {sq.result}</div>}
            </div>
          ))}
        </div>
      )}

      {step >= 3 && (
        <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #8BA888', background: 'rgba(139,168,136,0.05)', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>Merged Answer</div>
          <div style={{ fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.5 }}>{ex.merged}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Back</button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C' }}>{['Query', 'Decompose', 'Retrieve', 'Merge'][step]}</span>
        <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step >= 3} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step >= 3 ? '#D4C5A9' : '#5A6B5C', cursor: step >= 3 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
