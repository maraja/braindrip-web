import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const formats = [
  { name: 'FP32', bits: 32, memory: '100%', memoryFactor: 1, levels: 'billions', color: '#2C3E2D', precision: 'Full', range: '\u00b13.4\u00d710\u00b3\u2078', representable: Array.from({ length: 40 }, (_, i) => -1 + i * 0.05) },
  { name: 'FP16', bits: 16, memory: '50%', memoryFactor: 0.5, levels: '65,536', color: '#D4A843', precision: 'High', range: '\u00b165,504', representable: Array.from({ length: 20 }, (_, i) => -1 + i * 0.105) },
  { name: 'INT8', bits: 8, memory: '25%', memoryFactor: 0.25, levels: '256', color: '#C76B4A', precision: 'Medium', range: '-128 to 127', representable: Array.from({ length: 10 }, (_, i) => -1 + i * 0.222) },
  { name: 'INT4', bits: 4, memory: '12.5%', memoryFactor: 0.125, levels: '16', color: '#8BA888', precision: 'Low', range: '-8 to 7', representable: Array.from({ length: 5 }, (_, i) => -1 + i * 0.5) },
];

const sampleWeights = [-0.82, -0.61, -0.33, -0.15, -0.02, 0.11, 0.29, 0.44, 0.67, 0.91];

function quantize(value: number, levels: number[]): number {
  let closest = levels[0];
  let minDist = Math.abs(value - closest);
  for (const l of levels) {
    const d = Math.abs(value - l);
    if (d < minDist) { minDist = d; closest = l; }
  }
  return closest;
}

export default function QuantizationLevelsViz() {
  const [selected, setSelected] = useState(0);
  const fmt = formats[selected];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Quantization Levels: FP32 to INT4
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {formats.map((f, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', border: selected === i ? `2px solid ${f.color}` : '1px solid #E5DFD3', background: selected === i ? `${f.color}10` : 'white', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: selected === i ? 700 : 400, fontSize: '0.85rem', color: '#2C3E2D' }}>
            {f.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {[{ label: 'Bits', value: `${fmt.bits}-bit` }, { label: 'Memory', value: fmt.memory }, { label: 'Levels', value: fmt.levels }, { label: 'Precision', value: fmt.precision }].map((item, i) => (
          <div key={i} style={{ padding: '0.5rem', background: `${fmt.color}08`, borderRadius: '8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{item.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: fmt.color, marginTop: '0.15rem' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Number Line: Representable Values</div>
        <div style={{ position: 'relative', height: '40px', background: '#EDE9DF', borderRadius: '8px', margin: '0 0.5rem' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: '#C5BFB3' }} />
          {fmt.representable.map((v, i) => {
            const left = ((v + 1) / 2) * 100;
            return (
              <div key={i} style={{ position: 'absolute', left: `${left}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '6px', height: '6px', borderRadius: '50%', background: fmt.color, opacity: 0.7 }} />
            );
          })}
          <div style={{ position: 'absolute', left: 0, bottom: '-18px', fontSize: '0.65rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace" }}>-1.0</div>
          <div style={{ position: 'absolute', left: '50%', bottom: '-18px', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace" }}>0.0</div>
          <div style={{ position: 'absolute', right: 0, bottom: '-18px', fontSize: '0.65rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace" }}>1.0</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Weight Mapping (FP32 original vs {fmt.name})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {sampleWeights.map((w, i) => {
            const qw = quantize(w, fmt.representable);
            const error = Math.abs(w - qw);
            const barWidth = Math.abs(w) * 100;
            const qBarWidth = Math.abs(qw) * 100;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '45px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A6F5E', textAlign: 'right' as const }}>{w.toFixed(2)}</div>
                <div style={{ flex: 1, position: 'relative', height: '14px', background: '#EDE9DF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: w >= 0 ? '50%' : `${50 - barWidth / 2}%`, width: `${barWidth / 2}%`, height: '100%', background: 'rgba(44,62,45,0.15)', borderRadius: '2px' }} />
                  <div style={{ position: 'absolute', left: qw >= 0 ? '50%' : `${50 - qBarWidth / 2}%`, width: `${qBarWidth / 2}%`, height: '100%', background: `${fmt.color}50`, borderRadius: '2px' }} />
                </div>
                <div style={{ width: '45px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: fmt.color, fontWeight: 600 }}>{qw.toFixed(2)}</div>
                <div style={{ width: '35px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: error > 0.1 ? '#C76B4A' : '#8BA888' }}>{error > 0.001 ? `\u00b1${error.toFixed(2)}` : '\u22480'}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.8rem 1rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', border: '1px solid rgba(139,168,136,0.15)' }}>
        <div style={{ fontSize: '0.78rem', color: '#7A6F5E', lineHeight: 1.5 }}>
          <strong style={{ color: '#2C3E2D' }}>{fmt.name}</strong> uses {fmt.bits} bits per weight.
          Memory reduction: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: fmt.color, fontWeight: 600 }}>{(1 / fmt.memoryFactor).toFixed(0)}x</span> smaller.
          Range: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt.range}</span>
        </div>
      </div>
    </div>
  );
}
