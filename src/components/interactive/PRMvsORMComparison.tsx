import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const STEPS = [
  { text: 'Let x be the number of apples. Maria has 3x apples.', correct: true, ormScore: null as number | null, prmScore: 0.95 },
  { text: 'Together they have x + 3x = 4x apples.', correct: true, ormScore: null, prmScore: 0.92 },
  { text: 'We know the total is 24, so 4x = 24.', correct: true, ormScore: null, prmScore: 0.94 },
  { text: 'Solving: x = 24 / 4 = 6.', correct: true, ormScore: null, prmScore: 0.96 },
  { text: 'So Maria has 3 * 6 = 18 apples.', correct: true, ormScore: 1.0, prmScore: 0.97 },
];

const ERROR_STEP = { text: 'Solving: x = 24 / 3 = 8.', correct: false, ormScore: null, prmScore: 0.12 };
const ERROR_FINAL = { text: 'So Maria has 3 * 8 = 24 apples.', correct: false, ormScore: 0.0, prmScore: 0.08 };

export default function PRMvsORMComparison() {
  const [errorAt, setErrorAt] = useState<number | null>(null);
  const [mode, setMode] = useState<'orm' | 'prm'>('prm');

  const getSteps = () => {
    if (errorAt === null) return STEPS;
    const result = [...STEPS];
    result[errorAt] = { ...ERROR_STEP };
    // Propagate error to final step
    if (errorAt < 4) {
      result[4] = { ...ERROR_FINAL };
    }
    return result;
  };

  const steps = getSteps();
  const finalCorrect = errorAt === null;
  const ormVerdict = finalCorrect ? 'Correct' : 'Incorrect';

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Process vs Outcome Reward Models
        </h3>
      </div>

      {/* Problem statement */}
      <div style={{ background: 'rgba(212, 168, 67, 0.08)', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.3rem' }}>Math Problem</div>
        <div style={{ fontSize: '0.92rem', color: '#2C3E2D', fontWeight: 500 }}>
          John has some apples. Maria has 3 times as many apples as John. Together they have 24 apples. How many apples does Maria have?
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['orm', 'prm'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.45rem 1rem', borderRadius: '8px', cursor: 'pointer',
            border: mode === m ? '2px solid #C76B4A' : '1px solid #E5DFD3',
            background: mode === m ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: mode === m ? '#C76B4A' : '#2C3E2D',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
          }}>{m === 'orm' ? 'Outcome RM (ORM)' : 'Process RM (PRM)'}</button>
        ))}
      </div>

      {/* Error injection */}
      <div style={{ fontSize: '0.82rem', color: '#6B7B6E', marginBottom: '0.8rem' }}>
        Click a step to introduce an error, or click again to remove it:
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
        {steps.map((step, i) => {
          const isError = errorAt !== null && i >= errorAt;
          const showScore = mode === 'prm' || (mode === 'orm' && i === steps.length - 1);

          return (
            <div
              key={i}
              onClick={() => {
                if (i === 0) return; // Don't allow error on first step
                if (i <= 3) setErrorAt(errorAt === i ? null : i);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                padding: '0.7rem 1rem', borderRadius: '10px',
                background: isError ? 'rgba(199, 107, 74, 0.06)' : 'rgba(139, 168, 136, 0.06)',
                border: `1px solid ${isError ? 'rgba(199, 107, 74, 0.2)' : 'rgba(139, 168, 136, 0.15)'}`,
                cursor: i > 0 && i <= 3 ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {/* Step number */}
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isError ? '#C76B4A' : '#8BA888', color: '#FDFBF7',
                fontSize: '0.75rem', fontWeight: 700,
              }}>{i + 1}</div>

              {/* Step text */}
              <div style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.4 }}>
                {step.text}
              </div>

              {/* Score indicator */}
              {showScore && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                  {mode === 'prm' ? (
                    <>
                      <div style={{
                        width: '40px', height: '6px', borderRadius: '3px', background: '#E5DFD3', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${(isError && i >= (errorAt ?? 99) ? (i === errorAt ? ERROR_STEP.prmScore : ERROR_FINAL.prmScore) : step.prmScore) * 100}%`,
                          height: '100%', borderRadius: '3px', transition: 'all 0.3s',
                          background: isError && i >= (errorAt ?? 99) ? '#C76B4A' : '#8BA888',
                        }} />
                      </div>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600,
                        color: isError && i >= (errorAt ?? 99) ? '#C76B4A' : '#8BA888',
                      }}>
                        {(isError && i >= (errorAt ?? 99) ? (i === errorAt ? ERROR_STEP.prmScore : ERROR_FINAL.prmScore) : step.prmScore).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    i === steps.length - 1 && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700,
                        padding: '0.2rem 0.6rem', borderRadius: '6px',
                        background: finalCorrect ? 'rgba(139, 168, 136, 0.15)' : 'rgba(199, 107, 74, 0.15)',
                        color: finalCorrect ? '#8BA888' : '#C76B4A',
                      }}>{ormVerdict}</span>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison insight */}
      <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.3rem' }}>ORM (Outcome)</div>
            <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5 }}>
              {errorAt === null
                ? 'Final answer is correct. ORM gives full credit regardless of reasoning quality.'
                : 'Final answer is wrong. ORM rejects everything, even the correct early steps.'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888', marginBottom: '0.3rem' }}>PRM (Process)</div>
            <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5 }}>
              {errorAt === null
                ? 'Every step scores high. PRM validates the reasoning chain, not just the outcome.'
                : `Detects the error at step ${(errorAt ?? 0) + 1}. Correct steps before the error still score well, providing precise feedback.`}
            </div>
          </div>
        </div>
      </div>

      {errorAt !== null && mode === 'prm' && (
        <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#C76B4A', fontStyle: 'italic' }}>
          PRM advantage: pinpoints exactly where reasoning went wrong, enabling targeted correction.
        </div>
      )}
    </div>
  );
}
