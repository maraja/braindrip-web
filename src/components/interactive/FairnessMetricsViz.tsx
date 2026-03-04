import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const METRICS = [
  {
    name: 'Demographic Parity', color: '#C76B4A',
    formula: 'P(Y=1 | A=0) = P(Y=1 | A=1)',
    desc: 'Equal positive outcome rates across groups regardless of group membership.',
    groupA: { label: 'Group A', positive: 60, total: 100 },
    groupB: { label: 'Group B', positive: 45, total: 100 },
    verdict: 'NOT satisfied — Group A receives positive outcomes at 60% vs Group B at 45%.',
    tradeoff: 'Ignores whether groups differ in the base rate of the target variable.',
  },
  {
    name: 'Equalized Odds', color: '#D4A843',
    formula: 'P(Y=1 | A=0, Y*=y) = P(Y=1 | A=1, Y*=y) for y in {0,1}',
    desc: 'Equal true positive and false positive rates across groups.',
    groupA: { label: 'Group A', positive: 72, total: 100 },
    groupB: { label: 'Group B', positive: 68, total: 100 },
    verdict: 'Close to satisfied — TPR differs by only 4 percentage points.',
    tradeoff: 'Requires access to ground truth labels, which may themselves be biased.',
  },
  {
    name: 'Calibration', color: '#8BA888',
    formula: 'P(Y*=1 | S=s, A=a) = s for all groups a',
    desc: 'When the model says 70% confidence, it should be correct 70% of the time for all groups.',
    groupA: { label: 'Group A', positive: 70, total: 100 },
    groupB: { label: 'Group B', positive: 71, total: 100 },
    verdict: 'Satisfied — both groups show well-calibrated predictions (~70%).',
    tradeoff: 'Cannot guarantee equalized odds simultaneously (impossibility theorem).',
  },
];

export default function FairnessMetricsViz() {
  const [metricIdx, setMetricIdx] = useState(0);
  const [showTradeoff, setShowTradeoff] = useState(false);
  const m = METRICS[metricIdx];
  const rateA = m.groupA.positive;
  const rateB = m.groupB.positive;
  const gap = Math.abs(rateA - rateB);
  const satisfied = gap <= 5;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Fairness Metrics Comparison</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare how different fairness definitions evaluate the same model.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {METRICS.map((mt, i) => (
          <button key={i} onClick={() => { setMetricIdx(i); setShowTradeoff(false); }} style={{
            padding: '0.4rem 0.85rem', borderRadius: '8px', border: `1px solid ${metricIdx === i ? mt.color : '#E5DFD3'}`,
            background: metricIdx === i ? `${mt.color}12` : 'transparent', cursor: 'pointer',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.8rem', fontWeight: 600,
            color: metricIdx === i ? mt.color : '#5A6B5C',
          }}>{mt.name}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: m.color, fontWeight: 600 }}>{m.formula}</div>
        <div style={{ fontSize: '0.82rem', color: '#5A6B5C', marginTop: '0.3rem', lineHeight: 1.5 }}>{m.desc}</div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {[m.groupA, m.groupB].map((g, i) => (
          <div key={i} style={{ flex: 1, background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{g.label}</div>
            <div style={{ position: 'relative' as const, height: '24px', background: '#E5DFD3', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ position: 'absolute' as const, left: 0, top: 0, height: '100%', width: `${g.positive}%`, background: m.color, borderRadius: '6px', transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#2C3E2D', marginTop: '0.3rem' }}>{g.positive}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: satisfied ? '#8BA888' : '#C76B4A' }} />
        <span style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 600 }}>Gap: {gap}pp — {m.verdict}</span>
      </div>

      <button onClick={() => setShowTradeoff(!showTradeoff)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E5DFD3', cursor: 'pointer',
        background: showTradeoff ? '#F5F0E6' : 'transparent', color: '#5A6B5C',
        fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
      }}>
        {showTradeoff ? 'Hide' : 'Show'} Tradeoffs
      </button>

      {showTradeoff && (
        <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: `${m.color}0A`, borderRadius: '10px', border: `1px solid ${m.color}22`, fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{m.tradeoff}</div>
      )}
    </div>
  );
}
