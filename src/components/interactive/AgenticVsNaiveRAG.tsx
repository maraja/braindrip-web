import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const scenarios = [
  {
    q: 'Compare the GDP of France and Germany in 2023',
    naive: { steps: ['Single retrieval for "GDP France Germany 2023"'], docs: 1, quality: 45, issue: 'Only found France GDP, missed Germany data' },
    agentic: { steps: ['Retrieve "France GDP 2023"', 'Retrieve "Germany GDP 2023"', 'Compare and synthesize'], docs: 2, quality: 92, issue: 'Complete comparison with both data points' },
  },
  {
    q: 'How did COVID affect remote work adoption in tech companies?',
    naive: { steps: ['Single retrieval for full question'], docs: 1, quality: 55, issue: 'Found general article, lacks specifics' },
    agentic: { steps: ['Retrieve "COVID remote work statistics"', 'Evaluate: need tech-specific data', 'Retrieve "tech companies remote work 2020-2023"', 'Synthesize findings'], docs: 3, quality: 88, issue: 'Rich answer with stats and trends' },
  },
];

export default function AgenticVsNaiveRAG() {
  const [scenIdx, setScenIdx] = useState(0);
  const s = scenarios[scenIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Naive RAG vs Agentic RAG</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare single-shot retrieval vs iterative agentic retrieval.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {scenarios.map((_, i) => (
          <button key={i} onClick={() => setScenIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${scenIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: scenIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: scenIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: scenIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>Scenario {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        Q: {s.q}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'Naive RAG', data: s.naive, color: '#C76B4A' },
          { label: 'Agentic RAG', data: s.agentic, color: '#8BA888' },
        ].map(m => (
          <div key={m.label} style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${m.color}20`, background: m.color + '08' }}>
            <div style={{ fontSize: '0.65rem', color: m.color, fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>{m.label}</div>
            <div style={{ marginBottom: '0.4rem' }}>
              {m.data.steps.map((step, i) => (
                <div key={i} style={{ fontSize: '0.7rem', color: '#5A6B5C', padding: '0.15rem 0', borderLeft: `2px solid ${m.color}40`, paddingLeft: '0.4rem', marginBottom: '0.1rem' }}>{step}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.6rem', color: '#7A8B7C' }}>Docs: {m.data.docs}</span>
              <span style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: m.color }}>Quality: {m.data.quality}%</span>
            </div>
            <div style={{ background: '#E5DFD3', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${m.data.quality}%`, height: '100%', background: m.color, borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '0.68rem', color: '#5A6B5C', marginTop: '0.3rem', fontStyle: 'italic' }}>{m.data.issue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
