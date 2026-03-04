import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Technique = 'quantized' | 'eviction' | 'sparse';

const techniques: Record<Technique, {
  label: string; color: string; memorySaving: number; qualityImpact: number;
  desc: string; detail: string;
  blocks: { label: string; kept: boolean; faded: boolean }[];
}> = {
  quantized: {
    label: 'Quantized KV', color: '#C76B4A', memorySaving: 50, qualityImpact: 2,
    desc: 'Reduce KV cache precision from FP16 to INT8 or INT4.',
    detail: 'All tokens are kept, but each key/value vector uses fewer bits. FP16 \u2192 INT8 halves memory with ~1-2% quality loss. INT4 saves 75% but may degrade long-context tasks.',
    blocks: Array.from({ length: 12 }, (_, i) => ({ label: `T${i}`, kept: true, faded: false })),
  },
  eviction: {
    label: 'Token Eviction', color: '#D4A843', memorySaving: 60, qualityImpact: 5,
    desc: 'Evict low-importance tokens from the KV cache entirely.',
    detail: 'Tokens with low cumulative attention scores are dropped. Reduces cache size significantly but risks losing context. Works best when combined with attention sinks (keeping the first token).',
    blocks: Array.from({ length: 12 }, (_, i) => ({ label: `T${i}`, kept: i === 0 || i > 3 && i % 2 === 0 || i >= 9, faded: false })),
  },
  sparse: {
    label: 'Sparse Attention', color: '#8BA888', memorySaving: 40, qualityImpact: 3,
    desc: 'Only attend to important tokens: local window + high-attention anchors.',
    detail: 'Combines a sliding window (recent tokens) with globally important tokens selected by attention scores. Keeps O(sqrt(n)) tokens instead of O(n), balancing memory and quality.',
    blocks: Array.from({ length: 12 }, (_, i) => ({ label: `T${i}`, kept: true, faded: i > 2 && i < 9 && i % 3 !== 0 })),
  },
};

const techKeys: Technique[] = ['quantized', 'eviction', 'sparse'];

export default function KVCacheCompressionViz() {
  const [active, setActive] = useState<Set<Technique>>(new Set<Technique>(['quantized']));

  const toggle = (t: Technique) => {
    const next = new Set(active);
    if (next.has(t)) next.delete(t); else next.add(t);
    setActive(next);
  };

  const totalSaving = active.size > 0
    ? Math.min(85, Array.from(active).reduce((s, t) => s + techniques[t].memorySaving * (active.size > 1 ? 0.7 : 1), 0))
    : 0;
  const totalQuality = Array.from(active).reduce((s, t) => s + techniques[t].qualityImpact, 0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          KV Cache Compression Techniques
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Toggle compression techniques to see memory savings vs quality tradeoffs.
        </p>
      </div>

      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {techKeys.map(t => {
          const tech = techniques[t];
          const on = active.has(t);
          return (
            <button key={t} onClick={() => toggle(t)} style={{
              padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
              border: `1px solid ${on ? tech.color : '#E5DFD3'}`,
              background: on ? `${tech.color}12` : 'transparent',
              color: on ? tech.color : '#5A6B5C',
              fontWeight: on ? 600 : 400, fontSize: '0.78rem',
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
            }}>
              {on ? '\u2713 ' : ''}{tech.label}
            </button>
          );
        })}
      </div>

      {/* Side-by-side visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {techKeys.map(t => {
          const tech = techniques[t];
          const on = active.has(t);
          return (
            <div key={t} style={{
              background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem',
              opacity: on ? 1 : 0.45, transition: 'opacity 0.2s',
              border: on ? `1px solid ${tech.color}40` : '1px solid transparent',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: tech.color, marginBottom: '0.4rem' }}>{tech.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginBottom: '0.5rem' }}>
                {tech.blocks.map((b, i) => (
                  <div key={i} style={{
                    height: '20px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    background: !b.kept ? '#E5DFD3' : b.faded ? `${tech.color}30` : tech.color,
                    color: !b.kept ? '#999' : b.faded ? tech.color : '#fff',
                    textDecoration: !b.kept ? 'line-through' : 'none',
                  }}>
                    {b.label}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#5A6B5C', lineHeight: 1.4 }}>{tech.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Aggregate stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.3rem' }}>Memory Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.3rem', fontWeight: 700, color: '#8BA888' }}>
            {Math.round(totalSaving)}%
          </div>
          <div style={{ height: '6px', background: '#E5DFD3', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${totalSaving}%`, background: '#8BA888', borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.3rem' }}>Quality Impact</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.3rem', fontWeight: 700, color: totalQuality > 5 ? '#C76B4A' : '#D4A843' }}>
            -{totalQuality}%
          </div>
          <div style={{ height: '6px', background: '#E5DFD3', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${totalQuality * 5}%`, background: totalQuality > 5 ? '#C76B4A' : '#D4A843', borderRadius: '3px', transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Active technique details */}
      {active.size > 0 && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
          {Array.from(active).map(t => techniques[t].detail).join(' ')}
        </div>
      )}
      {active.size === 0 && (
        <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', fontSize: '0.78rem', color: '#7A8B7C', textAlign: 'center' }}>
          Toggle a technique above to see its details.
        </div>
      )}
    </div>
  );
}
