import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const models = [
  { name: '7B', params: 7, fp32GB: 28, basePerplexity: 8.2, costPerHour: 0.80 },
  { name: '13B', params: 13, fp32GB: 52, basePerplexity: 7.1, costPerHour: 1.50 },
  { name: '30B', params: 30, fp32GB: 120, basePerplexity: 5.8, costPerHour: 3.40 },
  { name: '70B', params: 70, fp32GB: 280, basePerplexity: 4.9, costPerHour: 8.00 },
];

const quantLevels = [
  { name: 'FP32', bits: 32, memDiv: 1, speedup: 1.0, perpInc: 0, color: '#2C3E2D' },
  { name: 'FP16', bits: 16, memDiv: 2, speedup: 1.8, perpInc: 0.01, color: '#D4A843' },
  { name: 'INT8', bits: 8, memDiv: 4, speedup: 2.5, perpInc: 0.15, color: '#C76B4A' },
  { name: 'INT4', bits: 4, memDiv: 8, speedup: 3.2, perpInc: 0.55, color: '#8BA888' },
];

export default function QuantizationImpactCalc() {
  const [modelIdx, setModelIdx] = useState(0);
  const [quantIdx, setQuantIdx] = useState(2);
  const model = models[modelIdx];
  const quant = quantLevels[quantIdx];

  const memoryGB = model.fp32GB / quant.memDiv;
  const perplexity = model.basePerplexity + quant.perpInc;
  const costPerHour = model.costPerHour / quant.speedup;
  const monthlySavings = (model.costPerHour - costPerHour) * 24 * 30;
  const gpusNeeded = Math.ceil(memoryGB / 80);
  const fp32Gpus = Math.ceil(model.fp32GB / 80);

  const bars = [
    { label: 'Memory', fp32: model.fp32GB, quant: memoryGB, unit: 'GB', color: '#D4A843' },
    { label: 'Speed', fp32: 1.0, quant: quant.speedup, unit: 'x', color: '#8BA888', invert: true },
    { label: 'Perplexity', fp32: model.basePerplexity, quant: perplexity, unit: '', color: '#C76B4A' },
    { label: 'Cost/hr', fp32: model.costPerHour, quant: costPerHour, unit: '$', color: '#2C3E2D' },
  ];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Quantization Impact Calculator
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Model Size</div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {models.map((m, i) => (
              <button key={i} onClick={() => setModelIdx(i)} style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', border: modelIdx === i ? '2px solid #C76B4A' : '1px solid #E5DFD3', background: modelIdx === i ? 'rgba(199,107,74,0.08)' : 'white', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: modelIdx === i ? 700 : 400, fontSize: '0.8rem', color: '#2C3E2D' }}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Quantization</div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {quantLevels.map((q, i) => (
              <button key={i} onClick={() => setQuantIdx(i)} style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', border: quantIdx === i ? `2px solid ${q.color}` : '1px solid #E5DFD3', background: quantIdx === i ? `${q.color}10` : 'white', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: quantIdx === i ? 700 : 400, fontSize: '0.8rem', color: '#2C3E2D' }}>
                {q.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {bars.map((bar, i) => {
          const maxVal = bar.invert ? Math.max(bar.fp32, bar.quant) : Math.max(bar.fp32, bar.quant);
          const fp32Pct = (bar.fp32 / maxVal) * 100;
          const quantPct = (bar.quant / maxVal) * 100;
          return (
            <div key={i} style={{ padding: '0.7rem', background: 'rgba(237,233,223,0.4)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{bar.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ fontSize: '0.6rem', color: '#7A6F5E', width: '32px' }}>FP32</div>
                  <div style={{ flex: 1, height: '16px', background: '#EDE9DF', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${fp32Pct}%`, height: '100%', background: 'rgba(44,62,45,0.2)', borderRadius: '4px', transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#7A6F5E', width: '55px', textAlign: 'right' as const }}>{bar.unit === '$' ? '$' : ''}{bar.fp32.toFixed(bar.fp32 % 1 === 0 && bar.unit !== '$' ? 0 : 1)}{bar.unit === 'x' ? 'x' : bar.unit === 'GB' ? ' GB' : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ fontSize: '0.6rem', color: bar.color, width: '32px', fontWeight: 600 }}>{quant.name}</div>
                  <div style={{ flex: 1, height: '16px', background: '#EDE9DF', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${quantPct}%`, height: '100%', background: `${bar.color}60`, borderRadius: '4px', transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: bar.color, fontWeight: 600, width: '55px', textAlign: 'right' as const }}>{bar.unit === '$' ? '$' : ''}{bar.quant.toFixed(bar.quant % 1 === 0 && bar.unit !== '$' ? 0 : 2)}{bar.unit === 'x' ? 'x' : bar.unit === 'GB' ? ' GB' : ''}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ padding: '0.7rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', textAlign: 'center' as const, border: '1px solid rgba(139,168,136,0.15)' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>GPUs Needed (A100 80GB)</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>{gpusNeeded}</div>
          <div style={{ fontSize: '0.65rem', color: '#7A6F5E' }}>vs {fp32Gpus} for FP32</div>
        </div>
        <div style={{ padding: '0.7rem', background: 'rgba(212,168,67,0.08)', borderRadius: '10px', textAlign: 'center' as const, border: '1px solid rgba(212,168,67,0.15)' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>Memory Reduction</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#D4A843' }}>{quant.memDiv}x</div>
          <div style={{ fontSize: '0.65rem', color: '#7A6F5E' }}>{model.fp32GB} GB &rarr; {memoryGB.toFixed(0)} GB</div>
        </div>
        <div style={{ padding: '0.7rem', background: 'rgba(199,107,74,0.08)', borderRadius: '10px', textAlign: 'center' as const, border: '1px solid rgba(199,107,74,0.15)' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>Monthly Savings</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#C76B4A' }}>${monthlySavings.toFixed(0)}</div>
          <div style={{ fontSize: '0.65rem', color: '#7A6F5E' }}>24/7 serving</div>
        </div>
      </div>
    </div>
  );
}
