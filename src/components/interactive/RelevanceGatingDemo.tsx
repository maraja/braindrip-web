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
    query: 'When was the Eiffel Tower built?',
    docs: [
      { text: 'The Eiffel Tower was completed in 1889 for the World Fair.', score: 0.95, verdict: 'Correct' },
      { text: 'Paris is known for its beautiful architecture.', score: 0.45, verdict: 'Ambiguous' },
      { text: 'The Tower of London is a historic castle.', score: 0.12, verdict: 'Incorrect' },
    ],
    action: 'Use Doc1 directly, refine Doc2, discard Doc3',
  },
  {
    query: 'What is quantum entanglement?',
    docs: [
      { text: 'Quantum computing uses qubits instead of classical bits.', score: 0.38, verdict: 'Ambiguous' },
      { text: 'The stock market closed higher today.', score: 0.05, verdict: 'Incorrect' },
      { text: 'Einstein called it "spooky action at a distance."', score: 0.52, verdict: 'Ambiguous' },
    ],
    action: 'No correct docs found → fall back to web search',
  },
];

export default function RelevanceGatingDemo() {
  const [scenIdx, setScenIdx] = useState(0);
  const s = scenarios[scenIdx];
  const verdictColors: Record<string, string> = { Correct: '#8BA888', Ambiguous: '#D4A843', Incorrect: '#C76B4A' };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>CRAG Relevance Gating</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how CRAG evaluates retrieval relevance and decides what to do.</p>
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

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>
        Q: {s.query}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {s.docs.map((d, i) => (
          <div key={i} style={{ padding: '0.5rem 0.65rem', borderRadius: '6px', border: `1px solid ${verdictColors[d.verdict]}30`, background: verdictColors[d.verdict] + '08', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#5A6B5C', lineHeight: 1.4 }}>{d.text}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", color: verdictColors[d.verdict], fontWeight: 700 }}>{d.verdict}</div>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C' }}>{(d.score * 100).toFixed(0)}%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const }}>Action</span>
        <span style={{ fontSize: '0.78rem', color: '#2C3E2D' }}>{s.action}</span>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.65rem' }}>
        {Object.entries(verdictColors).map(([label, color]) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />
            <span style={{ color: '#7A8B7C' }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
