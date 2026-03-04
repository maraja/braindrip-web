import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

export default function GoodhartLawViz() {
  const [pressure, setPressure] = useState(30);

  const proxyScore = Math.min(100, pressure * 1.8);
  const trueScore = pressure <= 40
    ? pressure * 1.5
    : 60 + (pressure - 40) * 0.3 - Math.pow((pressure - 40) / 20, 2) * 15;
  const clampedTrue = Math.max(0, Math.min(100, trueScore));
  const gap = Math.abs(proxyScore - clampedTrue);
  const diverging = pressure > 45;

  const getPhase = () => {
    if (pressure <= 25) return { name: 'Aligned', color: '#8BA888', desc: 'Proxy and true objective are well-correlated. Optimizing the proxy genuinely improves the true goal.' };
    if (pressure <= 50) return { name: 'Diverging', color: '#D4A843', desc: 'Proxy metric continues improving but true objective gains slow down. The proxy is becoming a less reliable signal.' };
    return { name: 'Goodharted', color: '#C76B4A', desc: 'Proxy metric is maximized but true objective is actively declining. The measure has become the target and ceased to be a good measure.' };
  };

  const phase = getPhase();

  const barStyle = (value: number, color: string) => ({
    position: 'relative' as const, height: '28px', background: '#E5DFD3', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.3rem',
  });

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Goodhart's Law</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Increase optimization pressure and watch the proxy metric diverge from the true objective.</p>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>Optimization Pressure</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: phase.color }}>{pressure}%</span>
        </div>
        <input type="range" min={5} max={95} value={pressure} onChange={e => setPressure(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: phase.color }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#8B9B8D' }}>
          <span>Low</span><span>Extreme</span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.4rem' }}>Proxy Metric (what we optimize)</div>
        <div style={barStyle(proxyScore, '#D4A843')}>
          <div style={{ position: 'absolute' as const, left: 0, top: 0, height: '100%', width: `${proxyScore}%`, background: '#D4A843', borderRadius: '8px', transition: 'width 0.3s' }} />
          <span style={{ position: 'absolute' as const, right: '8px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#2C3E2D' }}>{proxyScore.toFixed(0)}</span>
        </div>

        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.4rem', marginTop: '0.5rem' }}>True Objective (what we actually want)</div>
        <div style={barStyle(clampedTrue, '#8BA888')}>
          <div style={{ position: 'absolute' as const, left: 0, top: 0, height: '100%', width: `${clampedTrue}%`, background: diverging ? '#C76B4A' : '#8BA888', borderRadius: '8px', transition: 'width 0.3s' }} />
          <span style={{ position: 'absolute' as const, right: '8px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#2C3E2D' }}>{clampedTrue.toFixed(0)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: `${phase.color}10`, border: `1px solid ${phase.color}33` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: phase.color, fontWeight: 700, marginBottom: '0.2rem' }}>{phase.name}</div>
          <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.5 }}>{phase.desc}</div>
        </div>
        <div style={{ padding: '0.6rem', borderRadius: '8px', background: '#F5F0E6', textAlign: 'center' as const, minWidth: '80px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: gap > 30 ? '#C76B4A' : gap > 10 ? '#D4A843' : '#8BA888' }}>{gap.toFixed(0)}</div>
          <div style={{ fontSize: '0.68rem', color: '#8B9B8D' }}>Gap</div>
        </div>
      </div>

      <div style={{ padding: '0.6rem 0.85rem', background: '#F5F0E6', borderRadius: '8px', fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.6, fontStyle: 'italic' }}>
        "When a measure becomes a target, it ceases to be a good measure." — Goodhart's Law
      </div>
    </div>
  );
}
