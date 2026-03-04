import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const HARD_TOKENS = ['Classify', 'the', 'sentiment', 'of', 'this', 'review', ':'];
const SOFT_LENGTH = 8;

const makeVecs = (epoch: number) =>
  Array.from({ length: SOFT_LENGTH }, (_, i) =>
    Array.from({ length: 4 }, (_, j) => {
      const base = Math.sin((i * 7 + j * 3) * 0.5) * 0.3;
      const drift = Math.sin((epoch * 0.4 + i * 1.2 + j * 0.8)) * 0.6;
      return Math.max(-1, Math.min(1, base + drift));
    })
  );

const valToColor = (v: number) => {
  const t = (v + 1) / 2;
  if (t < 0.5) {
    const s = t * 2;
    return `rgb(${Math.round(44 + s * 155)}, ${Math.round(62 + s * 45)}, ${Math.round(45 + s * 29)})`;
  }
  const s = (t - 0.5) * 2;
  return `rgb(${Math.round(199 + s * 12)}, ${Math.round(107 - s * 40)}, ${Math.round(74 - s * 10)})`;
};

export default function SoftPromptDemo() {
  const [epoch, setEpoch] = useState(0);
  const [showVectors, setShowVectors] = useState(false);
  const vecs = makeVecs(epoch);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Soft Prompt Tuning
        </h3>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#5A6B5C', display: 'block', marginBottom: '0.5rem' }}>
          Training epoch: <strong style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>{epoch}</strong>
        </label>
        <input type="range" min={0} max={20} value={epoch} onChange={e => setEpoch(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5A6B5C' }}>
          <span>Init (random)</span><span>Converged</span>
        </div>
      </div>

      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#5A6B5C', marginBottom: '0.75rem', fontWeight: 600 }}>Input to Model</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.35rem', alignItems: 'center' }}>
          {vecs.map((v, i) => (
            <div key={`soft-${i}`} style={{
              padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1.5px dashed rgba(199,107,74,0.4)',
              background: `linear-gradient(135deg, ${valToColor(v[0])}, ${valToColor(v[2])})`,
              fontSize: '0.7rem', color: '#fff', fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.3)', transition: 'all 0.3s',
              minWidth: '28px', textAlign: 'center' as const,
            }}>
              s{i}
            </div>
          ))}
          <span style={{ color: '#5A6B5C', fontSize: '0.8rem', margin: '0 0.25rem' }}>|</span>
          {HARD_TOKENS.map((t, i) => (
            <div key={`hard-${i}`} style={{
              padding: '0.35rem 0.55rem', borderRadius: '6px', border: '1px solid #E5DFD3',
              background: 'rgba(139,168,136,0.08)', fontSize: '0.78rem', color: '#2C3E2D',
            }}>
              {t}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.65rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#C76B4A' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1.5px dashed rgba(199,107,74,0.4)', background: 'rgba(199,107,74,0.3)' }} /> Soft prompt (learned)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#5A6B5C' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px solid #E5DFD3', background: 'rgba(139,168,136,0.08)' }} /> Hard prompt (text)
          </span>
        </div>
      </div>

      <button onClick={() => setShowVectors(!showVectors)} style={{
        padding: '0.4rem 1rem', background: '#FDFBF7', border: '1.5px solid #E5DFD3', borderRadius: '8px',
        cursor: 'pointer', fontSize: '0.8rem', color: '#2C3E2D', marginBottom: '1rem',
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
      }}>
        {showVectors ? 'Hide' : 'Show'} embedding vectors
      </button>

      {showVectors && (
        <div style={{ background: 'rgba(199,107,74,0.04)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', overflowX: 'auto' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#5A6B5C' }}>
            {vecs.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.2rem', alignItems: 'center' }}>
                <span style={{ color: '#C76B4A', fontWeight: 600, minWidth: '24px' }}>s{i}:</span>
                [{v.map((val, j) => (
                  <span key={j} style={{ color: valToColor(val), fontWeight: 600 }}>
                    {val.toFixed(3)}{j < v.length - 1 ? ', ' : ''}
                  </span>
                ))}]
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.3rem' }}>Trainable Parameters</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#2C3E2D' }}>
            {SOFT_LENGTH} tokens x 4096 dims = <strong style={{ color: '#C76B4A' }}>32,768</strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginTop: '0.2rem' }}>~0.0005% of a 7B model</div>
        </div>
        <div style={{ background: 'rgba(212,168,67,0.08)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.3rem' }}>Key Insight</div>
          <div style={{ fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
            Soft prompts live in continuous embedding space, not discrete token space. They can represent concepts no single word captures.
          </div>
        </div>
      </div>
    </div>
  );
}
