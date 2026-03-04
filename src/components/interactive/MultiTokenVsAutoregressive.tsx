import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const tokens = ['The', 'cat', 'sat', 'on', 'the', 'warm', 'sunny', 'mat'];

export default function MultiTokenVsAutoregressive() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'auto' | 'multi'>('auto');
  const n = mode === 'auto' ? 1 : 3;
  const maxSteps = Math.ceil(tokens.length / n);
  const revealed = Math.min(step * n, tokens.length);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Multi-Token vs Autoregressive</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare generating 1 token at a time vs N tokens per step.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['auto', 'multi'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setStep(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${mode === m ? '#C76B4A' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(199,107,74,0.08)' : 'transparent', color: mode === m ? '#C76B4A' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{m === 'auto' ? '1-Token (Standard)' : '3-Token (Multi)'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {tokens.map((t, i) => {
          const isRevealed = i < revealed;
          const isNewlyRevealed = i >= revealed - n && i < revealed;
          return (
            <span key={i} style={{
              padding: '0.3rem 0.5rem', borderRadius: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem',
              background: isNewlyRevealed ? 'rgba(199,107,74,0.15)' : isRevealed ? '#F0EBE1' : '#E5DFD3',
              color: isNewlyRevealed ? '#C76B4A' : isRevealed ? '#2C3E2D' : '#B0A898',
              border: isNewlyRevealed ? '1px solid #C76B4A' : '1px solid transparent',
              fontWeight: isNewlyRevealed ? 700 : 400, transition: 'all 0.2s',
            }}>{isRevealed ? t : '???'}</span>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Forward passes used</div>
          <div style={{ fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#C76B4A' }}>{step}</div>
        </div>
        <div style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Tokens generated</div>
          <div style={{ fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#8BA888' }}>{revealed}/{tokens.length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button onClick={() => setStep(0)} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: '#5A6B5C', fontSize: '0.78rem', cursor: 'pointer' }}>Reset</button>
        <button onClick={() => setStep(Math.min(step + 1, maxSteps))} disabled={step >= maxSteps} style={{
          padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #C76B4A', fontSize: '0.78rem', cursor: step >= maxSteps ? 'default' : 'pointer',
          background: step >= maxSteps ? '#E5DFD3' : 'rgba(199,107,74,0.08)', color: step >= maxSteps ? '#B0A898' : '#C76B4A', fontWeight: 600,
        }}>Step →</button>
      </div>

      <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#7A8B7C' }}>
        {mode === 'auto' ? `Standard: ${tokens.length} forward passes needed for ${tokens.length} tokens` : `Multi-token (3): only ${maxSteps} forward passes for ${tokens.length} tokens (${((1 - maxSteps / tokens.length) * 100).toFixed(0)}% fewer)`}
      </div>
    </div>
  );
}
