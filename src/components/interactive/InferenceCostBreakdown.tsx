import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const optimizations = [
  { key: 'quantization', label: 'INT8 Quantization', effects: { prefillCompute: 0.6, decodeCompute: 0.6, kvMemory: 0.5, weightsMemory: 0.5, network: 1.0 } },
  { key: 'caching', label: 'KV Cache Reuse', effects: { prefillCompute: 0.3, decodeCompute: 1.0, kvMemory: 0.6, weightsMemory: 1.0, network: 1.0 } },
  { key: 'batching', label: 'Continuous Batching', effects: { prefillCompute: 0.85, decodeCompute: 0.7, kvMemory: 1.1, weightsMemory: 1.0, network: 0.8 } },
];

const costComponents = [
  { key: 'prefillCompute', label: 'Prefill Compute', color: '#C76B4A', icon: '⚡' },
  { key: 'decodeCompute', label: 'Decode Compute', color: '#D4A843', icon: '🔄' },
  { key: 'kvMemory', label: 'KV Cache Memory', color: '#8BA888', icon: '🗄️' },
  { key: 'weightsMemory', label: 'Model Weights', color: '#6B8EC7', icon: '📦' },
  { key: 'network', label: 'Network/Transfer', color: '#9B6BC7', icon: '🌐' },
];

export default function InferenceCostBreakdown() {
  const [promptLen, setPromptLen] = useState(512);
  const [outputLen, setOutputLen] = useState(256);
  const [batchSize, setBatchSize] = useState(8);
  const [activeOpts, setActiveOpts] = useState<Set<string>>(new Set());

  const toggleOpt = (key: string) => {
    setActiveOpts(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const baseCosts: Record<string, number> = {
    prefillCompute: promptLen * 0.002 / Math.sqrt(batchSize),
    decodeCompute: outputLen * 0.008 / Math.sqrt(batchSize),
    kvMemory: (promptLen + outputLen) * 0.001 * batchSize * 0.15,
    weightsMemory: 14 * 0.05,
    network: (promptLen + outputLen) * 0.0003,
  };

  const optimizedCosts: Record<string, number> = {};
  for (const c of costComponents) {
    let multiplier = 1;
    for (const opt of optimizations) {
      if (activeOpts.has(opt.key)) {
        multiplier *= opt.effects[c.key as keyof typeof opt.effects];
      }
    }
    optimizedCosts[c.key] = baseCosts[c.key] * multiplier;
  }

  const totalBase = Object.values(baseCosts).reduce((s, v) => s + v, 0);
  const totalOpt = Object.values(optimizedCosts).reduce((s, v) => s + v, 0);
  const maxCost = Math.max(...Object.values(baseCosts), ...Object.values(optimizedCosts));
  const savingsPct = totalBase > 0 ? Math.round((1 - totalOpt / totalBase) * 100) : 0;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Inference Cost Breakdown
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Adjust parameters and toggle optimizations to see how each component of inference cost changes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
            Prompt: {promptLen} tok
          </label>
          <input type="range" min={64} max={4096} step={64} value={promptLen}
            onChange={e => setPromptLen(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
            Output: {outputLen} tok
          </label>
          <input type="range" min={32} max={2048} step={32} value={outputLen}
            onChange={e => setOutputLen(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#D4A843' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
            Batch Size: {batchSize}
          </label>
          <input type="range" min={1} max={64} step={1} value={batchSize}
            onChange={e => setBatchSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#8BA888' }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Optimizations
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {optimizations.map(opt => {
          const active = activeOpts.has(opt.key);
          return (
            <button key={opt.key} onClick={() => toggleOpt(opt.key)} style={{
              padding: '0.35rem 0.7rem', borderRadius: '6px',
              border: `1px solid ${active ? '#8BA888' : '#E5DFD3'}`,
              background: active ? 'rgba(139, 168, 136, 0.12)' : 'transparent',
              color: active ? '#8BA888' : '#5A6B5C',
              fontWeight: active ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {active ? '✓ ' : ''}{opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Cost per Request (relative units)
        </div>
        {costComponents.map(c => {
          const base = baseCosts[c.key];
          const opt = optimizedCosts[c.key];
          const barMax = maxCost > 0 ? maxCost : 1;
          return (
            <div key={c.key} style={{ marginBottom: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#2C3E2D', fontWeight: 500 }}>
                  {c.icon} {c.label}
                </span>
                <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: c.color, fontWeight: 600 }}>
                  {opt.toFixed(2)} {activeOpts.size > 0 && opt < base ? `(−${Math.round((1 - opt / base) * 100)}%)` : ''}
                </span>
              </div>
              <div style={{ position: 'relative', height: '8px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
                {activeOpts.size > 0 && (
                  <div style={{
                    position: 'absolute', width: `${(base / barMax) * 100}%`, height: '100%',
                    background: c.color, opacity: 0.2, borderRadius: '4px',
                  }} />
                )}
                <div style={{
                  position: 'relative', width: `${(opt / barMax) * 100}%`, height: '100%',
                  background: c.color, borderRadius: '4px', transition: 'width 0.3s',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Base Cost</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#2C3E2D' }}>{totalBase.toFixed(2)}</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Optimized</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>{totalOpt.toFixed(2)}</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Savings</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: savingsPct > 0 ? '#C76B4A' : '#B5AFA3' }}>
            {savingsPct}%
          </div>
        </div>
      </div>
    </div>
  );
}
