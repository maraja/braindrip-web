import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

const dimensions = [
  { name: 'Setup Cost', ragBase: 0.3, ftBase: 0.8, ragLabel: 'Low — API + vector DB', ftLabel: 'High — GPU training' },
  { name: 'Data Freshness', ragBase: 0.95, ftBase: 0.2, ragLabel: 'Real-time updates', ftLabel: 'Stale until retrained' },
  { name: 'Accuracy', ragBase: 0.75, ftBase: 0.85, ragLabel: 'Good with reranking', ftLabel: 'Strong internalized knowledge' },
  { name: 'Hallucination Control', ragBase: 0.85, ftBase: 0.5, ragLabel: 'Grounded in retrieved docs', ftLabel: 'Can still hallucinate' },
  { name: 'Latency', ragBase: 0.5, ftBase: 0.9, ragLabel: 'Added retrieval step', ftLabel: 'Single forward pass' },
  { name: 'Scalability', ragBase: 0.9, ftBase: 0.4, ragLabel: 'Add docs without retraining', ftLabel: 'Retrain for new data' },
];

const scenarios = [
  { name: 'Customer Support Bot', ragMod: [0.1, 0.15, 0.1, 0.1, -0.05, 0.1], ftMod: [-0.05, -0.1, 0.05, -0.15, 0.05, -0.1], verdict: 'RAG is preferred — knowledge base changes frequently and answers must be grounded.' },
  { name: 'Code Completion', ragMod: [-0.1, -0.1, -0.15, -0.05, -0.15, -0.1], ftMod: [0.05, 0.15, 0.1, 0.1, 0.05, 0.15], verdict: 'Fine-tuning wins — code patterns are stable and latency matters for real-time completion.' },
  { name: 'Legal Document Analysis', ragMod: [0.05, 0.1, 0.15, 0.1, 0, 0.1], ftMod: [0.05, -0.15, 0.1, -0.1, 0.05, -0.15], verdict: 'RAG + fine-tuning hybrid — domain expertise via fine-tuning, specific precedents via RAG.' },
  { name: 'Medical Q&A', ragMod: [0.05, 0.1, 0.1, 0.15, -0.1, 0.05], ftMod: [0.1, -0.1, 0.1, -0.2, 0.05, -0.1], verdict: 'RAG preferred — critical to ground answers in verified medical literature. Low hallucination is essential.' },
];

export default function RAGvsFineTuning() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = scenarios[scenarioIdx];

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          RAG vs Fine-Tuning Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare RAG and fine-tuning across key dimensions. Select a use case to see how tradeoffs shift.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => setScenarioIdx(i)} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
            border: `1px solid ${scenarioIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: scenarioIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: scenarioIdx === i ? '#C76B4A' : '#5A6B5C', fontWeight: scenarioIdx === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{s.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.78rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8BA888', display: 'inline-block' }} /> RAG
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#D4A843', display: 'inline-block' }} /> Fine-Tuning
        </span>
      </div>

      {dimensions.map((dim, i) => {
        const ragVal = clamp(dim.ragBase + scenario.ragMod[i]);
        const ftVal = clamp(dim.ftBase + scenario.ftMod[i]);
        const ragWins = ragVal > ftVal;
        return (
          <div key={dim.name} style={{ marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{dim.name}</span>
              <span style={{ fontSize: '0.68rem', color: ragWins ? '#8BA888' : '#D4A843', fontWeight: 600 }}>
                {ragWins ? 'RAG advantage' : 'Fine-tuning advantage'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr 36px', gap: '0.4rem', alignItems: 'center', marginBottom: '0.15rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#8BA888', fontWeight: 500, textAlign: 'right' }}>RAG</span>
              <div style={{ height: '14px', background: '#F0EBE1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ragVal * 100}%`, background: 'linear-gradient(90deg, #8BA888, #A8C4A5)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#7A8B7C' }}>{(ragVal * 100).toFixed(0)}%</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr 36px', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#D4A843', fontWeight: 500, textAlign: 'right' }}>FT</span>
              <div style={{ height: '14px', background: '#F0EBE1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ftVal * 100}%`, background: 'linear-gradient(90deg, #D4A843, #E0C06A)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#7A8B7C' }}>{(ftVal * 100).toFixed(0)}%</span>
            </div>
          </div>
        );
      })}

      <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', marginTop: '1rem', fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        <strong>Verdict:</strong> {scenario.verdict}
      </div>
    </div>
  );
}
