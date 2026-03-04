import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const cotSteps = [
  'Start with numbers 2, 5, 6, 7. Target: 24.',
  '2 + 5 = 7. Remaining: 7, 6, 7.',
  '7 × 6 = 42. Remaining: 42, 7.',
  '42 - 7 = 35. Not 24. Failed.',
];

const totSteps = [
  { label: 'Generate 3 first-step candidates', branches: ['2 × 6 = 12', '7 - 5 = 2', '6 - 2 = 4'], scores: [0.7, 0.3, 0.8] },
  { label: 'Expand best: 6-2=4', branches: ['4 × 7 = 28', '4 × 5 = 20', '4 + 5 = 9'], scores: [0.4, 0.6, 0.2] },
  { label: 'Backtrack, try: 2×6=12', branches: ['12 + 7 = 19', '12 × (7-5) = 24!'], scores: [0.1, 1.0] },
  { label: 'Solution found!', branches: ['(2 × 6) × (7 - 5) = 12 × 2 = 24'], scores: [1.0] },
];

export default function ToTvsCOT() {
  const [mode, setMode] = useState<'cot' | 'tot'>('cot');
  const [step, setStep] = useState(0);
  const maxStep = mode === 'cot' ? cotSteps.length - 1 : totSteps.length - 1;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>CoT vs Tree of Thought</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare linear chain-of-thought vs branching tree-of-thought on a puzzle.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['cot', 'tot'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setStep(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${mode === m ? '#C76B4A' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(199,107,74,0.08)' : 'transparent', color: mode === m ? '#C76B4A' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{m === 'cot' ? 'Chain-of-Thought' : 'Tree-of-Thought'}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', minHeight: '120px', marginBottom: '0.75rem' }}>
        {mode === 'cot' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {cotSteps.slice(0, step + 1).map((s, i) => (
              <div key={i} style={{ padding: '0.3rem 0.5rem', borderLeft: `3px solid ${i === cotSteps.length - 1 ? '#C76B4A' : '#8BA888'}`, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2C3E2D' }}>{s}</div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {totSteps.slice(0, step + 1).map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.2rem' }}>{s.label}</div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {s.branches.map((b, j) => (
                    <span key={j} style={{
                      padding: '0.2rem 0.45rem', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
                      background: s.scores[j] >= 1 ? 'rgba(139,168,136,0.2)' : s.scores[j] > 0.5 ? 'rgba(212,168,67,0.15)' : '#F0EBE1',
                      border: s.scores[j] >= 1 ? '1px solid #8BA888' : '1px solid transparent',
                      color: s.scores[j] >= 1 ? '#8BA888' : '#5A6B5C', fontWeight: s.scores[j] >= 1 ? 700 : 400,
                    }}>{b} <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>({(s.scores[j] * 100).toFixed(0)}%)</span></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev</button>
        <span style={{ fontSize: '0.72rem', color: '#7A8B7C' }}>Step {step + 1}/{maxStep + 1}</span>
        <button onClick={() => setStep(Math.min(maxStep, step + 1))} disabled={step >= maxStep} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step >= maxStep ? '#D4C5A9' : '#5A6B5C', cursor: step >= maxStep ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next →</button>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: mode === 'cot' ? '#C76B4A' : '#8BA888', textAlign: 'center' }}>
        {mode === 'cot' ? 'CoT follows a single path — if it fails, there is no recovery.' : 'ToT explores multiple branches and backtracks when needed — more robust.'}
      </div>
    </div>
  );
}
