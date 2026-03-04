import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const phases = {
  prefill: {
    label: 'Prefill Phase',
    detail: 'Process all input tokens in parallel',
    bound: 'Compute-bound',
    gpuUtil: 95,
    color: '#C76B4A',
    characteristics: [
      'All input tokens processed at once',
      'High GPU compute utilization',
      'Matrix multiplications dominate',
      'Duration scales with input length',
    ],
  },
  decode: {
    label: 'Decode Phase',
    detail: 'Generate output tokens one by one',
    bound: 'Memory-bound',
    gpuUtil: 30,
    color: '#D4A843',
    characteristics: [
      'One token generated per step',
      'Low GPU compute utilization',
      'Memory bandwidth is bottleneck',
      'Duration scales with output length',
    ],
  },
};

export default function PrefillDecodeTimeline() {
  const [mode, setMode] = useState<'unified' | 'disaggregated'>('unified');
  const [inputLen, setInputLen] = useState(512);
  const [outputLen, setOutputLen] = useState(256);

  const prefillMs = Math.round(inputLen * 0.08);
  const decodeMs = Math.round(outputLen * 1.5);
  const totalMs = prefillMs + decodeMs;
  const prefillPct = Math.round((prefillMs / totalMs) * 100);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prefill vs Decode Phases
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Inference has two distinct phases with different hardware requirements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
            Input tokens: {inputLen}
          </label>
          <input type="range" min={64} max={2048} step={64} value={inputLen}
            onChange={e => setInputLen(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
            Output tokens: {outputLen}
          </label>
          <input type="range" min={32} max={1024} step={32} value={outputLen}
            onChange={e => setOutputLen(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#D4A843' }}
          />
        </div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Timeline ({totalMs}ms total)
        </div>
        <div style={{ display: 'flex', height: '32px', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{
            width: `${prefillPct}%`, background: phases.prefill.color, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', fontWeight: 600,
            transition: 'width 0.3s',
          }}>
            Prefill {prefillMs}ms
          </div>
          <div style={{
            width: `${100 - prefillPct}%`, background: phases.decode.color, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', fontWeight: 600,
            transition: 'width 0.3s',
          }}>
            Decode {decodeMs}ms
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {Object.values(phases).map(p => (
            <div key={p.label} style={{
              padding: '0.75rem', borderRadius: '8px', background: '#FDFBF7',
              border: `1px solid ${p.color}30`,
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: p.color, marginBottom: '0.2rem' }}>{p.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.5rem' }}>{p.detail}</div>
              <div style={{ marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.15rem' }}>
                  <span style={{ color: '#7A8B7C' }}>GPU Utilization</span>
                  <span style={{ color: p.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{p.gpuUtil}%</span>
                </div>
                <div style={{ height: '6px', background: '#E5DFD3', borderRadius: '3px' }}>
                  <div style={{ width: `${p.gpuUtil}%`, height: '100%', background: p.color, borderRadius: '3px' }} />
                </div>
              </div>
              <div style={{ fontSize: '0.62rem', padding: '0.2rem 0.45rem', background: `${p.color}15`, borderRadius: '4px', color: p.color, fontWeight: 600, display: 'inline-block' }}>
                {p.bound}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {(['unified', 'disaggregated'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '6px',
            border: `1px solid ${mode === m ? '#8BA888' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(139, 168, 136, 0.08)' : 'transparent',
            color: mode === m ? '#8BA888' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {m} serving
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
        {mode === 'unified' ? (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>Unified: Same GPU does both</div>
            <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.6 }}>
              A single GPU handles prefill and decode sequentially. During decode, the GPU's compute units are largely idle (only {phases.decode.gpuUtil}% utilized) because each step generates just one token.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.3rem' }}>Disaggregated: Specialized hardware</div>
            <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.6 }}>
              Prefill runs on compute-optimized GPUs (high FLOPS). Decode runs on memory-optimized GPUs (high bandwidth). Each phase gets hardware matched to its bottleneck, improving overall throughput by 2-4x.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
