import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Mode = 'combined' | 'disaggregated';

const inputTokens = ['The', 'history', 'of', 'computing', 'starts', 'with', 'Charles', 'Babbage'];
const outputTokens = ['who', 'designed', 'the', 'Analytical', 'Engine'];

export default function PrefillDecodeViz() {
  const [mode, setMode] = useState<Mode>('combined');
  const [phase, setPhase] = useState<'prefill' | 'decode'>('prefill');

  const prefillFlops = inputTokens.length * 2.4; // billion FLOPs
  const decodeBandwidth = outputTokens.length * 1.2; // GB/s needed
  const combinedUtil = 62;
  const disaggPrefillUtil = 91;
  const disaggDecodeUtil = 88;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prefill-Decode Disaggregation
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare combined vs disaggregated inference. Prefill is compute-bound; decode is memory-bound.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['combined', 'disaggregated'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${mode === m ? '#C76B4A' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: mode === m ? '#C76B4A' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", textTransform: 'capitalize',
          }}>
            {m}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {(['prefill', 'decode'] as const).map(p => (
          <button key={p} onClick={() => setPhase(p)} style={{
            padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${phase === p ? (p === 'prefill' ? '#D4A843' : '#8BA888') : '#E5DFD3'}`,
            background: phase === p ? (p === 'prefill' ? 'rgba(212,168,67,0.08)' : 'rgba(139,168,136,0.08)') : 'transparent',
            color: phase === p ? (p === 'prefill' ? '#D4A843' : '#8BA888') : '#5A6B5C',
            fontWeight: phase === p ? 600 : 400, fontSize: '0.75rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", textTransform: 'capitalize',
          }}>
            {p} Phase
          </button>
        ))}
      </div>

      {/* Phase visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* Prefill */}
        <div style={{
          background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem',
          border: phase === 'prefill' ? '1px solid #D4A84360' : '1px solid transparent',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D4A843', marginBottom: '0.15rem' }}>Prefill Phase</div>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', marginBottom: '0.5rem' }}>Compute-bound | All tokens in parallel</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '0.5rem' }}>
            {inputTokens.map((t, i) => (
              <span key={i} style={{
                padding: '0.15rem 0.35rem', borderRadius: '3px', fontSize: '0.6rem',
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                background: phase === 'prefill' ? '#D4A843' : '#D4A84340',
                color: phase === 'prefill' ? '#fff' : '#D4A843',
                transition: 'all 0.2s',
              }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', color: '#5A6B5C' }}>
            <span style={{ fontWeight: 600 }}>Bottleneck:</span>
            <span>GPU FLOPS ({prefillFlops.toFixed(1)} TFLOPS)</span>
          </div>
        </div>

        {/* Decode */}
        <div style={{
          background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem',
          border: phase === 'decode' ? '1px solid #8BA88860' : '1px solid transparent',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8BA888', marginBottom: '0.15rem' }}>Decode Phase</div>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', marginBottom: '0.5rem' }}>Memory-bound | One token at a time</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '0.5rem' }}>
            {outputTokens.map((t, i) => (
              <span key={i} style={{
                padding: '0.15rem 0.35rem', borderRadius: '3px', fontSize: '0.6rem',
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                background: phase === 'decode' ? '#8BA888' : '#8BA88840',
                color: phase === 'decode' ? '#fff' : '#8BA888',
                transition: 'all 0.2s',
              }}>
                {t}{i < outputTokens.length - 1 ? '' : '...'}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', color: '#5A6B5C' }}>
            <span style={{ fontWeight: 600 }}>Bottleneck:</span>
            <span>Memory bandwidth ({decodeBandwidth.toFixed(1)} GB/s)</span>
          </div>
        </div>
      </div>

      {/* Hardware assignment */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Hardware Assignment ({mode})
        </div>
        {mode === 'combined' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '80px', fontSize: '0.68rem', color: '#2C3E2D', fontWeight: 600 }}>GPU Pool</div>
              <div style={{ flex: 1, display: 'flex', height: '22px', borderRadius: '4px', overflow: 'hidden', gap: '1px' }}>
                <div style={{ width: '55%', background: '#D4A843', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#fff', fontWeight: 600 }}>Prefill</div>
                <div style={{ width: '45%', background: '#8BA888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#fff', fontWeight: 600 }}>Decode</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#C76B4A', fontWeight: 600, minWidth: '35px' }}>{combinedUtil}%</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C', marginLeft: '85px' }}>
              Same GPUs handle both phases -- neither fully utilized
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '80px', fontSize: '0.68rem', color: '#D4A843', fontWeight: 600 }}>Prefill GPUs</div>
              <div style={{ flex: 1, height: '22px', background: 'rgba(229,223,211,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${disaggPrefillUtil}%`, height: '100%', background: '#D4A843', borderRadius: '4px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#D4A843', fontWeight: 600, minWidth: '35px' }}>{disaggPrefillUtil}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '80px', fontSize: '0.68rem', color: '#8BA888', fontWeight: 600 }}>Decode GPUs</div>
              <div style={{ flex: 1, height: '22px', background: 'rgba(229,223,211,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${disaggDecodeUtil}%`, height: '100%', background: '#8BA888', borderRadius: '4px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#8BA888', fontWeight: 600, minWidth: '35px' }}>{disaggDecodeUtil}%</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C', marginLeft: '85px' }}>
              Specialized hardware: high-FLOPS for prefill, high-bandwidth for decode
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>GPU Utilization</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: mode === 'disaggregated' ? '#8BA888' : '#C76B4A' }}>
            {mode === 'combined' ? `${combinedUtil}%` : `~${Math.round((disaggPrefillUtil + disaggDecodeUtil) / 2)}%`}
          </div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Throughput Gain</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>
            {mode === 'disaggregated' ? '+45%' : 'baseline'}
          </div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Complexity</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#5A6B5C' }}>
            {mode === 'combined' ? 'Low' : 'High'}
          </div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        {mode === 'combined'
          ? 'In combined mode, prefill and decode share the same GPUs. Prefill underutilizes memory bandwidth while decode underutilizes compute, leading to ~62% average utilization.'
          : 'Disaggregation routes prefill to compute-optimized GPUs and decode to bandwidth-optimized GPUs. KV caches are transferred between pools, adding latency but improving overall throughput by ~45%.'}
      </div>
    </div>
  );
}
