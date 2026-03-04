import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const fsmStates = [
  { id: 'START', label: 'Start', validTokens: ['{'], invalidTokens: ['[', '"', 'true', '123', 'null'] },
  { id: 'KEY_OR_END', label: 'Key or }', validTokens: ['"name"', '"age"', '}'], invalidTokens: [':', ',', '123', 'true'] },
  { id: 'COLON', label: 'Colon', validTokens: [':'], invalidTokens: ['{', '}', '"text"', '123'] },
  { id: 'VALUE', label: 'Value', validTokens: ['"Alice"', '30', 'true', 'null'], invalidTokens: ['{', '}', ':', ','] },
  { id: 'COMMA_OR_END', label: ', or }', validTokens: [',', '}'], invalidTokens: ['"text"', '123', ':', '{'] },
  { id: 'NEXT_KEY', label: 'Next Key', validTokens: ['"age"', '"city"'], invalidTokens: ['}', ':', '123', 'true'] },
  { id: 'DONE', label: 'Complete', validTokens: [], invalidTokens: [] },
];

const generatedSequence = ['{', '"name"', ':', '"Alice"', ',', '"age"', ':', '30', '}'];

export default function ConstrainedDecodingViz() {
  const [step, setStep] = useState(0);
  const currentState = fsmStates[Math.min(step, fsmStates.length - 1)];
  const generated = generatedSequence.slice(0, step);
  const isDone = step >= generatedSequence.length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Constrained Decoding Visualization
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {fsmStates.slice(0, -1).map((s, i) => (
          <div key={i} style={{ padding: '0.35rem 0.6rem', borderRadius: '7px', fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, background: i === Math.min(step, fsmStates.length - 2) ? 'rgba(199,107,74,0.15)' : i < step ? 'rgba(139,168,136,0.12)' : '#EDE9DF', color: i === Math.min(step, fsmStates.length - 2) ? '#C76B4A' : i < step ? '#8BA888' : '#7A6F5E', border: `1px solid ${i === Math.min(step, fsmStates.length - 2) ? '#C76B4A' : 'transparent'}` }}>
            {s.label}
            {i < fsmStates.length - 2 && <span style={{ margin: '0 0.2rem', color: '#C5BFB3' }}> &rarr;</span>}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: '#EDE9DF', borderRadius: '10px' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Generated so far</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: '#2C3E2D', minHeight: '1.4rem' }}>
          {generated.length === 0 ? <span style={{ color: '#C5BFB3' }}>( waiting... )</span> : generated.join(' ')}
          {!isDone && <span style={{ color: '#C76B4A', animation: 'none' }}> |</span>}
        </div>
      </div>

      {!isDone && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.4rem' }}>
              Valid Tokens (allowed by grammar)
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' as const }}>
              {currentState.validTokens.map((t, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(139,168,136,0.15)', color: '#2C3E2D', border: '1px solid #8BA888', fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.4rem' }}>
              Masked Tokens (probability = 0)
            </div>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' as const }}>
              {currentState.invalidTokens.map((t, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(199,107,74,0.08)', color: '#C5BFB3', border: '1px solid #E5DFD3', textDecoration: 'line-through' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setStep(s => Math.min(s + 1, generatedSequence.length))} disabled={isDone} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: isDone ? '#E5DFD3' : '#C76B4A', color: isDone ? '#7A6F5E' : 'white', cursor: isDone ? 'default' : 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
          {isDone ? 'Generation Complete' : `Generate: ${generatedSequence[step]}`}
        </button>
        <button onClick={() => setStep(0)} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: 'white', color: '#2C3E2D', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
          Reset
        </button>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', border: '1px solid rgba(139,168,136,0.15)' }}>
        <div style={{ fontSize: '0.78rem', color: '#7A6F5E', lineHeight: 1.6 }}>
          <strong style={{ color: '#2C3E2D' }}>How it works:</strong> A finite state machine tracks the grammar state. At each decoding step, tokens that would violate the grammar have their logits set to <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>-inf</span>, ensuring only structurally valid JSON is produced.
        </div>
      </div>
    </div>
  );
}
