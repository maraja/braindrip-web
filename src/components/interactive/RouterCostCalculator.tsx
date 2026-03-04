import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const strategies = [
  { name: 'Conservative', desc: 'Route only obvious simple queries', distribution: [30, 20, 50], qualityDelta: -0.5 },
  { name: 'Balanced', desc: 'Moderate routing confidence threshold', distribution: [40, 35, 25], qualityDelta: -1.5 },
  { name: 'Aggressive', desc: 'Maximize cost savings', distribution: [55, 30, 15], qualityDelta: -3.0 },
];

const modelCosts = { small: 0.10, medium: 0.50, large: 2.50 };

export default function RouterCostCalculator() {
  const [volume, setVolume] = useState(100000);
  const [strategy, setStrategy] = useState(1);
  const [avgTokens, setAvgTokens] = useState(500);

  const s = strategies[strategy];
  const singleModelCost = volume * avgTokens * (modelCosts.large / 1_000_000);
  const routedCost =
    volume * (s.distribution[0] / 100) * avgTokens * (modelCosts.small / 1_000_000) +
    volume * (s.distribution[1] / 100) * avgTokens * (modelCosts.medium / 1_000_000) +
    volume * (s.distribution[2] / 100) * avgTokens * (modelCosts.large / 1_000_000);
  const saved = singleModelCost - routedCost;
  const pctSaved = Math.round((saved / singleModelCost) * 100);

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}`;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Router Cost Calculator
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Estimate savings from model routing based on your traffic profile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
            Monthly Queries: {volume.toLocaleString()}
          </label>
          <input type="range" min={10000} max={1000000} step={10000} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
            Avg Tokens/Query: {avgTokens}
          </label>
          <input type="range" min={100} max={2000} step={50} value={avgTokens}
            onChange={e => setAvgTokens(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }}
          />
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Routing Strategy
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {strategies.map((st, i) => (
          <button key={st.name} onClick={() => setStrategy(i)} style={{
            padding: '0.45rem 0.8rem', borderRadius: '8px', flex: '1',
            border: `1px solid ${strategy === i ? '#C76B4A' : '#E5DFD3'}`,
            background: strategy === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: strategy === i ? '#C76B4A' : '#2C3E2D' }}>{st.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#7A8B7C', marginTop: '0.15rem' }}>{st.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Query Distribution
        </div>
        <div style={{ display: 'flex', height: '28px', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          {[
            { pct: s.distribution[0], color: '#8BA888', label: 'Small' },
            { pct: s.distribution[1], color: '#D4A843', label: 'Medium' },
            { pct: s.distribution[2], color: '#C76B4A', label: 'Large' },
          ].map(d => (
            <div key={d.label} style={{
              width: `${d.pct}%`, background: d.color, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', color: '#fff', fontWeight: 600, transition: 'width 0.3s',
            }}>
              {d.pct}%
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#7A8B7C' }}>
          <span>Small ($0.10/M tok)</span>
          <span>Medium ($0.50/M tok)</span>
          <span>Large ($2.50/M tok)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Single Large Model</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.3rem', fontWeight: 700, color: '#C76B4A' }}>{fmt(singleModelCost)}/mo</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', border: '1px solid rgba(139, 168, 136, 0.3)' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', textTransform: 'uppercase', fontWeight: 600 }}>With Routing</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.3rem', fontWeight: 700, color: '#8BA888' }}>{fmt(routedCost)}/mo</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Savings</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#8BA888' }}>{fmt(saved)} ({pctSaved}%)</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Quality Impact</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#D4A843' }}>{s.qualityDelta}%</div>
        </div>
      </div>
    </div>
  );
}
