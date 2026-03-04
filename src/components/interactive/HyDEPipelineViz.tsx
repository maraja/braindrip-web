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
  { name: 'Query', icon: '❓', content: 'What are the health benefits of green tea?', desc: 'User submits a natural language query' },
  { name: 'Generate Hypothetical', icon: '💭', content: 'Green tea contains catechins and EGCG which provide antioxidant benefits. Studies show it may reduce risk of cardiovascular disease by 20-30%, improve brain function through L-theanine, and support metabolic health.', desc: 'LLM generates a hypothetical ideal answer document' },
  { name: 'Embed Hypothetical', icon: '📐', content: '[0.82, -0.15, 0.63, 0.44, -0.21, ...]', desc: 'Embed the hypothetical document (not the query!) into the vector space' },
  { name: 'Retrieve Real Docs', icon: '🔍', content: 'Top match (0.94): "A meta-analysis of 11 studies found green tea catechins reduce LDL cholesterol..." \nMatch 2 (0.89): "EGCG in green tea has been shown to increase fat oxidation by 17%..."', desc: 'Use the hypothetical embedding to find real, similar documents' },
];

export default function HyDEPipelineViz() {
  const [stepIdx, setStepIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>HyDE Pipeline</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>HyDE: generate a hypothetical document, embed it, then retrieve real documents.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '1rem', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1 }}>
            <button onClick={() => setStepIdx(i)} style={{
              flex: 1, padding: '0.4rem 0.2rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
              border: `1px solid ${stepIdx === i ? '#C76B4A' : '#E5DFD3'}`,
              background: i <= stepIdx ? (stepIdx === i ? 'rgba(199,107,74,0.08)' : 'rgba(139,168,136,0.04)') : '#F0EBE1',
              fontSize: '0.58rem', color: stepIdx === i ? '#C76B4A' : '#7A8B7C', fontWeight: stepIdx === i ? 600 : 400,
            }}>
              <div style={{ fontSize: '0.85rem' }}>{s.icon}</div>
              <div>{s.name}</div>
            </button>
            {i < steps.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.6rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>{steps[stepIdx].desc}</div>
        <div style={{ fontFamily: stepIdx === 2 ? "'JetBrains Mono', monospace" : 'inherit', fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {steps[stepIdx].content}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.72rem', color: '#5A6B5C' }}>
        Key insight: The hypothetical doc embedding is closer to relevant real docs than the short query would be, bridging the query-document gap.
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: stepIdx === 0 ? '#D4C5A9' : '#5A6B5C', cursor: stepIdx === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <button onClick={() => setStepIdx(Math.min(steps.length - 1, stepIdx + 1))} disabled={stepIdx >= steps.length - 1} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: stepIdx >= steps.length - 1 ? '#D4C5A9' : '#5A6B5C', cursor: stepIdx >= steps.length - 1 ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>
    </div>
  );
}
