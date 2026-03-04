import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'and', 'purred'];
const CELL_SIZE = 36;

export default function KVCacheVisualizer() {
  const [step, setStep] = useState(1);

  const generated = TOKENS.slice(0, step);
  const memoryKB = (step * 2 * 32 * 128 * 2) / 1024;
  const maxMemoryKB = (TOKENS.length * 2 * 32 * 128 * 2) / 1024;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>KV Cache Growth During Generation</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TOKENS.map((tok, i) => (
          <div key={i} style={{
            padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem',
            fontFamily: "'JetBrains Mono', monospace",
            background: i < step ? (i === step - 1 ? '#C76B4A' : '#8BA888') : '#E5DFD3',
            color: i < step ? '#fff' : '#999', fontWeight: i === step - 1 ? 700 : 500,
            transition: 'all 0.3s',
          }}>{tok}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['Key Cache (K)', 'Value Cache (V)'].map((label) => (
          <div key={label}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: TOKENS.length }).map((_, col) => (
                <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {Array.from({ length: 4 }).map((_, row) => (
                    <div key={row} style={{
                      width: CELL_SIZE, height: CELL_SIZE / 4, borderRadius: '3px',
                      background: col < step ? (col === step - 1 ? 'rgba(199,107,74,0.7)' : 'rgba(139,168,136,0.5)') : 'rgba(229,223,211,0.5)',
                      transition: 'all 0.3s',
                    }} />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>
              [{4} x {step}] — {step} token{step > 1 ? 's' : ''} cached
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
          <span style={{ color: '#2C3E2D', fontWeight: 600 }}>KV Cache Memory</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>{memoryKB.toFixed(1)} KB</span>
        </div>
        <div style={{ background: '#E5DFD3', borderRadius: '8px', height: '14px', overflow: 'hidden' }}>
          <div style={{
            width: `${(step / TOKENS.length) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, #8BA888, #C76B4A)', borderRadius: '8px', transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
          <span>0 KB</span><span>{maxMemoryKB.toFixed(1)} KB (full)</span>
        </div>
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        <strong>Step {step}:</strong> Token <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>"{generated[generated.length - 1]}"</span> generated.
        The model computes new K and V vectors and appends them to the cache. Previous K/V entries are <em>reused</em> — no recomputation needed.
        Memory grows <strong>linearly</strong> with sequence length.
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setStep(1)} disabled={step <= 1} style={{
          padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: '#fff',
          color: '#2C3E2D', cursor: step <= 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: step <= 1 ? 0.5 : 1,
        }}>Reset</button>
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step <= 1} style={{
          padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: '#fff',
          color: '#2C3E2D', cursor: step <= 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: step <= 1 ? 0.5 : 1,
        }}>Prev</button>
        <button onClick={() => setStep(s => Math.min(TOKENS.length, s + 1))} disabled={step >= TOKENS.length} style={{
          padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none', background: step >= TOKENS.length ? '#E5DFD3' : '#C76B4A',
          color: '#fff', cursor: step >= TOKENS.length ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600,
        }}>Generate Next Token</button>
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#999', fontFamily: "'JetBrains Mono', monospace" }}>
          {step}/{TOKENS.length}
        </span>
      </div>
    </div>
  );
}
