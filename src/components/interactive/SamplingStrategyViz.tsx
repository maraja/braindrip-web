import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const rawLogits = [
  { token: 'the', logit: 5.2 }, { token: 'a', logit: 4.8 }, { token: 'this', logit: 3.1 },
  { token: 'my', logit: 2.7 }, { token: 'one', logit: 2.0 }, { token: 'an', logit: 1.5 },
  { token: 'that', logit: 1.1 }, { token: 'some', logit: 0.6 }, { token: 'every', logit: 0.2 },
  { token: 'no', logit: -0.3 }, { token: 'her', logit: -0.9 }, { token: 'its', logit: -1.4 },
];

function softmax(logits: number[], temp: number) {
  const scaled = logits.map(l => l / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map(s => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

export default function SamplingStrategyViz() {
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.9);

  const probs = softmax(rawLogits.map(r => r.logit), temperature);
  const sorted = rawLogits.map((r, i) => ({ ...r, prob: probs[i] })).sort((a, b) => b.prob - a.prob);
  const topKSet = new Set(sorted.slice(0, topK).map(s => s.token));
  let cumulative = 0;
  const topPSet = new Set<string>();
  for (const s of sorted) {
    if (cumulative < topP) { topPSet.add(s.token); cumulative += s.prob; }
  }
  const activeSet = new Set([...topKSet].filter(t => topPSet.has(t)));
  const maxProb = Math.max(...sorted.map(s => s.prob));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Sampling Strategy Visualization
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Temperature', value: temperature, set: setTemperature, min: 0.1, max: 2.0, step: 0.1, color: '#C76B4A', desc: temperature < 0.5 ? 'Very focused' : temperature < 1.0 ? 'Slightly focused' : temperature < 1.5 ? 'More random' : 'Very random' },
          { label: 'Top-K', value: topK, set: setTopK, min: 1, max: 12, step: 1, color: '#D4A843', desc: `Keep top ${topK} tokens` },
          { label: 'Top-P', value: topP, set: setTopP, min: 0.1, max: 1.0, step: 0.05, color: '#8BA888', desc: `${(topP * 100).toFixed(0)}% probability mass` },
        ].map((ctrl, i) => (
          <div key={i} style={{ padding: '0.75rem', background: `${ctrl.color}08`, borderRadius: '10px', border: `1px solid ${ctrl.color}25` }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: ctrl.color, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{ctrl.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#2C3E2D', margin: '0.25rem 0' }}>{typeof ctrl.value === 'number' && ctrl.value % 1 !== 0 ? ctrl.value.toFixed(2) : ctrl.value}</div>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.value} onChange={e => ctrl.set(parseFloat(e.target.value))} style={{ width: '100%', accentColor: ctrl.color }} />
            <div style={{ fontSize: '0.7rem', color: '#7A6F5E', marginTop: '0.2rem' }}>{ctrl.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '0.5rem', fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
        Token Probability Distribution
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem', height: '140px', marginBottom: '0.5rem' }}>
        {sorted.map((s, i) => {
          const active = activeSet.has(s.token);
          const h = Math.max(4, (s.prob / maxProb) * 130);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: active ? '#2C3E2D' : '#C5BFB3', fontWeight: active ? 600 : 400 }}>
                {(s.prob * 100).toFixed(1)}%
              </div>
              <div style={{ width: '100%', height: `${h}px`, borderRadius: '4px 4px 0 0', background: active ? (i === 0 ? '#C76B4A' : '#8BA888') : '#E5DFD3', opacity: active ? 1 : 0.4, transition: 'all 0.3s' }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        {sorted.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: activeSet.has(s.token) ? '#2C3E2D' : '#C5BFB3', fontWeight: activeSet.has(s.token) ? 600 : 400 }}>
            {s.token}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
        <div style={{ fontSize: '0.75rem', color: '#7A6F5E' }}>
          Active tokens: <strong style={{ color: '#2C3E2D' }}>{activeSet.size}</strong> / {sorted.length}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#7A6F5E' }}>
          Filtered by top-k: <strong style={{ color: '#D4A843' }}>{sorted.length - topKSet.size}</strong>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#7A6F5E' }}>
          Filtered by top-p: <strong style={{ color: '#8BA888' }}>{sorted.length - topPSet.size}</strong>
        </div>
      </div>
    </div>
  );
}
