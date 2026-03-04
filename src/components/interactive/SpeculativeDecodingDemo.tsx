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
    prompt: 'The Eiffel Tower is located in',
    draft: ['Paris', ',', 'France', '.', 'It'],
    accepted: [true, true, true, true, true],
    speedup: '5x',
  },
  {
    prompt: 'Machine learning models are trained',
    draft: ['using', 'gradient', 'ascent', 'on', 'large'],
    accepted: [true, true, false, false, false],
    corrected: 'descent',
    speedup: '2.5x',
  },
  {
    prompt: 'To make a cake, first',
    draft: ['preheat', 'your', 'oven', 'to', '350'],
    accepted: [true, true, true, true, true],
    speedup: '5x',
  },
  {
    prompt: 'Quantum computing uses',
    draft: ['classical', 'bits', 'to', 'perform', 'calculations'],
    accepted: [false, false, false, false, false],
    corrected: 'qubits',
    speedup: '1x',
  },
];

export default function SpeculativeDecodingDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState<'draft' | 'verify' | 'result'>('draft');
  const s = scenarios[scenarioIdx];
  const acceptedCount = s.accepted.filter(Boolean).length;
  const firstRejectIdx = s.accepted.indexOf(false);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Speculative Decoding
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          A small draft model proposes tokens; the large target model verifies them all in one forward pass.
        </p>
      </div>

      {/* Scenario selector */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {scenarios.map((_, i) => (
          <button key={i} onClick={() => { setScenarioIdx(i); setStep('draft'); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${scenarioIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: scenarioIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: scenarioIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: scenarioIdx === i ? 600 : 400, fontSize: '0.75rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            Example {i + 1}
          </button>
        ))}
      </div>

      {/* Step buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {(['draft', 'verify', 'result'] as const).map((st, i) => (
          <button key={st} onClick={() => setStep(st)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${step === st ? '#D4A843' : '#E5DFD3'}`,
            background: step === st ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
            color: step === st ? '#D4A843' : '#5A6B5C',
            fontWeight: step === st ? 600 : 400, fontSize: '0.72rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {i + 1}. {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.62rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Prompt</div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D' }}>{s.prompt}</span>
      </div>

      {/* Draft / Verify / Result visualization */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        {step === 'draft' && (
          <>
            <div style={{ fontSize: '0.68rem', color: '#D4A843', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Draft Model (7B) generates {s.draft.length} candidates quickly
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {s.draft.map((tok, i) => (
                <span key={i} style={{
                  padding: '0.3rem 0.55rem', borderRadius: '5px',
                  background: '#D4A843', color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 600,
                }}>
                  {tok}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>
              Cost: {s.draft.length} cheap forward passes (~{s.draft.length * 5}ms total)
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <div style={{ fontSize: '0.68rem', color: '#8BA888', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Target Model (70B) verifies all {s.draft.length} tokens in 1 forward pass
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {s.draft.map((tok, i) => {
                const accepted = s.accepted[i];
                const showReject = !accepted;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                    <span style={{
                      padding: '0.3rem 0.55rem', borderRadius: '5px',
                      background: accepted ? '#8BA888' : '#C76B4A',
                      color: '#fff',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 600,
                      textDecoration: showReject ? 'line-through' : 'none',
                    }}>
                      {tok}
                    </span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 600, color: accepted ? '#8BA888' : '#C76B4A' }}>
                      {accepted ? '\u2713' : '\u2717'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>
              Cost: 1 expensive forward pass (~50ms) verifies all candidates simultaneously
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            <div style={{ fontSize: '0.68rem', color: '#2C3E2D', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Final Output ({acceptedCount} accepted + {firstRejectIdx >= 0 ? '1 correction' : '0 corrections'})
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#7A8B7C' }}>{s.prompt}</span>
              {s.draft.map((tok, i) => {
                if (i >= acceptedCount && i !== firstRejectIdx) return null;
                const isCorrected = i === firstRejectIdx && s.corrected;
                return (
                  <span key={i} style={{
                    padding: '0.3rem 0.55rem', borderRadius: '5px',
                    background: isCorrected ? '#5B8DB8' : '#8BA888',
                    color: '#fff',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 600,
                  }}>
                    {isCorrected ? s.corrected : tok}
                  </span>
                );
              })}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>
              Generated {acceptedCount + (firstRejectIdx >= 0 ? 1 : 0)} tokens in ~{25 + 50}ms instead of ~{(acceptedCount + (firstRejectIdx >= 0 ? 1 : 0)) * 50}ms
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Accepted</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#8BA888' }}>{acceptedCount}/{s.draft.length}</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Speedup</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#C76B4A' }}>{s.speedup}</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Target Passes</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>1</div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        {acceptedCount === s.draft.length
          ? `All ${s.draft.length} draft tokens were accepted. The draft model perfectly predicted the target model's output, achieving ${s.speedup} speedup with identical quality.`
          : `${acceptedCount} of ${s.draft.length} tokens accepted. The first rejection at position ${firstRejectIdx} was corrected by the target model. Output quality is identical to standard decoding -- speculative decoding never degrades quality.`}
      </div>
    </div>
  );
}
