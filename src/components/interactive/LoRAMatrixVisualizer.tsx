import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const RANKS = [1, 2, 4, 8, 16, 32, 64];
const D = 4096;

export default function LoRAMatrixVisualizer() {
  const [rankIdx, setRankIdx] = useState(3);
  const r = RANKS[rankIdx];
  const originalParams = D * D;
  const loraParams = D * r + r * D;
  const ratio = ((loraParams / originalParams) * 100).toFixed(3);

  const MatrixBox = ({ w, h, label, color, sub }: { w: number; h: number; label: string; color: string; sub: string }) => {
    const scale = 80;
    const wPx = Math.max(4, (w / D) * scale);
    const hPx = Math.max(4, (h / D) * scale);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.4rem' }}>
        <div style={{
          width: `${wPx}px`, height: `${hPx}px`, minWidth: '4px', minHeight: '4px',
          background: color, borderRadius: '3px', border: `1px solid ${color}`,
          transition: 'all 0.4s ease',
        }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#2C3E2D', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>{sub}</div>
      </div>
    );
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LoRA Low-Rank Decomposition
        </h3>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#5A6B5C', display: 'block', marginBottom: '0.5rem' }}>
          Rank r = <strong style={{ color: '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>{r}</strong>
        </label>
        <input type="range" min={0} max={RANKS.length - 1} step={1} value={rankIdx} onChange={e => setRankIdx(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5A6B5C' }}>
          {RANKS.map(rv => <span key={rv} style={{ fontWeight: rv === r ? 700 : 400, color: rv === r ? '#C76B4A' : '#5A6B5C' }}>{rv}</span>)}
        </div>
      </div>

      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#2C3E2D', marginBottom: '1.25rem' }}>
          W' = W + B &middot; A
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' as const }}>
          <MatrixBox w={D} h={D} label="W" color="rgba(44,62,45,0.15)" sub={`${D}x${D}`} />
          <span style={{ fontSize: '1.2rem', color: '#5A6B5C' }}>=</span>
          <MatrixBox w={D} h={D} label="W" color="rgba(44,62,45,0.15)" sub={`${D}x${D}`} />
          <span style={{ fontSize: '1.2rem', color: '#5A6B5C' }}>+</span>
          <MatrixBox w={r} h={D} label="B" color="rgba(199,107,74,0.5)" sub={`${D}x${r}`} />
          <span style={{ fontSize: '1rem', color: '#5A6B5C' }}>&middot;</span>
          <MatrixBox w={D} h={r} label="A" color="rgba(212,168,67,0.5)" sub={`${r}x${D}`} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(44,62,45,0.05)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>Original W</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#2C3E2D', fontWeight: 600 }}>
            {(originalParams / 1e6).toFixed(1)}M
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>parameters</div>
        </div>
        <div style={{ background: 'rgba(199,107,74,0.08)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>LoRA (A+B)</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#C76B4A', fontWeight: 600 }}>
            {loraParams < 1e6 ? `${(loraParams / 1e3).toFixed(0)}K` : `${(loraParams / 1e6).toFixed(2)}M`}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>parameters</div>
        </div>
        <div style={{ background: 'rgba(212,168,67,0.08)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>Compression</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#D4A843', fontWeight: 600 }}>
            {ratio}%
          </div>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>of original</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.6rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.5 }}>
        Key insight: LoRA assumes the weight update {'\u0394'}W has low intrinsic rank. Instead of learning a full {D}x{D} matrix, we learn two small matrices whose product approximates it. Matrix A is initialized with random Gaussian values, B with zeros, so {'\u0394'}W = 0 at the start of training.
      </div>
    </div>
  );
}
