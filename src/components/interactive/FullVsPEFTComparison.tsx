import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const MODELS = [
  { name: '7B', params: 7, fullMem: 28, peftMem: 6, peftPct: 0.16, storageF: 14, storageP: 0.016 },
  { name: '13B', params: 13, fullMem: 52, peftMem: 10, peftPct: 0.12, storageF: 26, storageP: 0.028 },
  { name: '70B', params: 70, fullMem: 280, peftMem: 18, peftPct: 0.06, storageF: 140, storageP: 0.084 },
];

const LAYERS = 12;

export default function FullVsPEFTComparison() {
  const [modelIdx, setModelIdx] = useState(0);
  const m = MODELS[modelIdx];
  const peftLayers = [2, 5, 8, 11];

  const renderBlock = (i: number, isPeft: boolean) => {
    const active = !isPeft || peftLayers.includes(i);
    const bg = isPeft
      ? (active ? 'rgba(199, 107, 74, 0.7)' : 'rgba(44, 62, 45, 0.08)')
      : 'rgba(199, 107, 74, 0.55)';
    return (
      <div key={i} style={{
        height: '18px', borderRadius: '3px', background: bg,
        border: active && isPeft ? '1.5px solid #C76B4A' : '1px solid rgba(44,62,45,0.1)',
        transition: 'all 0.3s',
      }} />
    );
  };

  const Metric = ({ label, full, peft, unit }: { label: string; full: string; peft: string; unit: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5DFD3' }}>
      <span style={{ color: '#5A6B5C', fontSize: '0.85rem' }}>{label}</span>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#2C3E2D', minWidth: '80px', textAlign: 'right' as const }}>{full} {unit}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#C76B4A', fontWeight: 600, minWidth: '80px', textAlign: 'right' as const }}>{peft} {unit}</span>
      </div>
    </div>
  );

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Full Fine-Tuning vs PEFT
        </h3>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#5A6B5C', display: 'block', marginBottom: '0.5rem' }}>Model Size</label>
        <input type="range" min={0} max={2} step={1} value={modelIdx} onChange={e => setModelIdx(+e.target.value)}
          style={{ width: '100%', accentColor: '#8BA888' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5A6B5C' }}>
          {MODELS.map(m2 => <span key={m2.name} style={{ fontWeight: m2.name === m.name ? 700 : 400, color: m2.name === m.name ? '#2C3E2D' : '#5A6B5C' }}>{m2.name}</span>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {[false, true].map(isPeft => (
          <div key={String(isPeft)} style={{ background: isPeft ? 'rgba(199,107,74,0.04)' : 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem', border: `1px solid ${isPeft ? 'rgba(199,107,74,0.2)' : '#E5DFD3'}` }}>
            <div style={{ fontWeight: 600, color: isPeft ? '#C76B4A' : '#2C3E2D', marginBottom: '0.75rem', fontSize: '0.95rem', fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {isPeft ? 'PEFT (LoRA)' : 'Full Fine-Tuning'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
              {Array.from({ length: LAYERS }).map((_, i) => renderBlock(i, isPeft))}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#5A6B5C', textAlign: 'center' as const }}>
              {isPeft ? `${m.peftPct}% trainable` : '100% trainable'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ color: '#2C3E2D', minWidth: '80px', textAlign: 'right' as const }}>Full FT</span>
          <span style={{ color: '#C76B4A', minWidth: '80px', textAlign: 'right' as const }}>PEFT</span>
        </div>
        <Metric label="Trainable Parameters" full={`${m.params}B`} peft={`${(m.params * m.peftPct / 100).toFixed(1)}M`} unit="" />
        <Metric label="GPU Memory" full={`${m.fullMem}`} peft={`${m.peftMem}`} unit="GB" />
        <Metric label="Storage / Task" full={`${m.storageF}`} peft={`${m.storageP}`} unit="GB" />
        <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(212,168,67,0.1)', borderRadius: '8px', fontSize: '0.8rem', color: '#2C3E2D' }}>
          Memory savings: <strong style={{ color: '#C76B4A' }}>{((1 - m.peftMem / m.fullMem) * 100).toFixed(0)}%</strong> &mdash;
          Storage savings: <strong style={{ color: '#C76B4A' }}>{((1 - m.storageP / m.storageF) * 100).toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
}
