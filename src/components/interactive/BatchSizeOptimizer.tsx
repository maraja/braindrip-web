import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const GPU_PRESETS: Record<string, { name: string; memGB: number; tflops: number }> = {
  A100: { name: 'A100 80GB', memGB: 80, tflops: 312 },
  H100: { name: 'H100 80GB', memGB: 80, tflops: 990 },
  A10G: { name: 'A10G 24GB', memGB: 24, tflops: 125 },
};

export default function BatchSizeOptimizer() {
  const [gpu, setGpu] = useState('A100');
  const [modelGB, setModelGB] = useState(14);
  const [kvPerToken, setKvPerToken] = useState(0.5);
  const [seqLen, setSeqLen] = useState(2048);
  const [slaMs, setSlaMs] = useState(200);

  const hw = GPU_PRESETS[gpu];
  const freeGB = hw.memGB - modelGB;
  const kvPerReqGB = (kvPerToken * seqLen) / 1024;
  const maxBatch = Math.max(1, Math.floor(freeGB / kvPerReqGB));

  const batchSizes = Array.from({ length: Math.min(maxBatch, 64) }, (_, i) => i + 1);

  const computeUtil = (bs: number) => Math.min(100, 15 + 85 * (1 - Math.exp(-bs / (hw.tflops / 100))));
  const ttft = (bs: number) => 15 + bs * 2.5 + 0.02 * bs * bs;
  const memUsed = (bs: number) => modelGB + bs * kvPerReqGB;

  const memBoundEnd = batchSizes.find((bs) => computeUtil(bs) > 70) || 1;

  const optimalBatch = batchSizes.reduce((best, bs) => {
    return ttft(bs) <= slaMs && computeUtil(bs) > computeUtil(best) ? bs : best;
  }, 1);

  const chartH = 120;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Batch Size Optimizer</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {Object.entries(GPU_PRESETS).map(([key, val]) => (
          <button key={key} onClick={() => setGpu(key)} style={{
            padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer',
            border: gpu === key ? '2px solid #C76B4A' : '1px solid #E5DFD3',
            background: gpu === key ? 'rgba(199,107,74,0.08)' : '#fff',
            color: gpu === key ? '#C76B4A' : '#2C3E2D', fontWeight: gpu === key ? 600 : 400,
          }}>{val.name}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Model Size (GB)', value: modelGB, set: setModelGB, min: 1, max: hw.memGB - 2, step: 1 },
          { label: 'KV Cache per Token (MB)', value: kvPerToken, set: setKvPerToken, min: 0.1, max: 2, step: 0.1 },
          { label: 'Sequence Length', value: seqLen, set: setSeqLen, min: 256, max: 16384, step: 256 },
          { label: 'TTFT SLA (ms)', value: slaMs, set: setSlaMs, min: 50, max: 500, step: 10 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
              <span style={{ color: '#2C3E2D' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>
                {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
              </span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8BA888' }} />
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem', height: chartH + 30 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 30, display: 'flex', gap: '1px', alignItems: 'flex-end' }}>
          {batchSizes.slice(0, 48).map((bs) => {
            const util = computeUtil(bs);
            const tf = ttft(bs);
            const isOptimal = bs === optimalBatch;
            const overSLA = tf > slaMs;
            const isMB = bs <= memBoundEnd;
            return (
              <div key={bs} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                <div style={{
                  width: '100%', minWidth: '3px', borderRadius: '3px 3px 0 0',
                  height: `${(util / 100) * chartH}px`, transition: 'all 0.2s',
                  background: isOptimal ? '#D4A843' : overSLA ? 'rgba(199,107,74,0.3)' : isMB ? 'rgba(139,168,136,0.4)' : '#8BA888',
                  border: isOptimal ? '2px solid #D4A843' : 'none',
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#999', fontFamily: "'JetBrains Mono', monospace" }}>
          <span>BS=1</span>
          {memBoundEnd > 1 && <span style={{ color: '#8BA888' }}>| memory-bound |</span>}
          <span style={{ color: '#2C3E2D' }}>compute-bound</span>
          <span>BS={Math.min(maxBatch, 48)}</span>
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.6rem', color: '#999' }}>GPU Utilization %</div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Max Batch Size', value: `${maxBatch}`, sub: `${freeGB.toFixed(1)}GB free`, color: '#2C3E2D' },
          { label: 'Optimal Batch', value: `${optimalBatch}`, sub: `${computeUtil(optimalBatch).toFixed(0)}% util`, color: '#D4A843' },
          { label: 'TTFT at Optimal', value: `${ttft(optimalBatch).toFixed(0)} ms`, sub: `SLA: ${slaMs} ms`, color: ttft(optimalBatch) <= slaMs ? '#8BA888' : '#C76B4A' },
          { label: 'Memory at Optimal', value: `${memUsed(optimalBatch).toFixed(1)} GB`, sub: `of ${hw.memGB} GB`, color: '#2C3E2D' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: '100px', background: 'rgba(229,223,211,0.2)', borderRadius: '10px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{item.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#999' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        With {hw.name} and a {modelGB}GB model, you can fit up to <strong>{maxBatch} concurrent requests</strong>.
        The optimal batch size under a {slaMs}ms TTFT SLA is <strong style={{ color: '#D4A843' }}>{optimalBatch}</strong>,
        achieving <strong>{computeUtil(optimalBatch).toFixed(0)}% GPU utilization</strong>.
        {optimalBatch < memBoundEnd ? ' The system is memory-bandwidth bound at this batch size.' : ' The system is compute-bound at this batch size.'}
      </div>
    </div>
  );
}
