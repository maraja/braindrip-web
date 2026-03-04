import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const TOKENS = ['The', 'answer', 'is', '42', '.', '<eos>'];
const REF_PROBS = [0.25, 0.20, 0.18, 0.15, 0.12, 0.10];

function computePolicy(refProbs: number[], shift: number): number[] {
  const raw = refProbs.map((p, i) => {
    const skew = i < 3 ? p * (1 + shift * 0.8) : p * (1 - shift * 0.5);
    return Math.max(skew, 0.01);
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((p) => p / sum);
}

function computeKL(p: number[], q: number[]): number {
  return p.reduce((sum, pi, i) => sum + pi * Math.log(pi / q[i]), 0);
}

const TRADEOFF = Array.from({ length: 11 }, (_, i) => {
  const beta = i * 0.1;
  const kl = beta * beta * 2.5;
  const reward = 1.0 + beta * 1.8 - beta * beta * 0.6;
  return { beta, kl: Math.round(kl * 100) / 100, reward: Math.round(reward * 100) / 100 };
});

export default function KLDivergenceExplorer() {
  const [shift, setShift] = useState(0);
  const policy = computePolicy(REF_PROBS, shift);
  const kl = computeKL(policy, REF_PROBS);
  const maxProb = Math.max(...REF_PROBS, ...policy);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          KL Divergence Explorer
        </h3>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6B7B6E' }}>Policy divergence from reference</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 600, color: kl > 0.5 ? '#C76B4A' : kl > 0.1 ? '#D4A843' : '#8BA888' }}>
            KL = {kl.toFixed(3)} nats
          </span>
        </div>
        <input
          type="range" min="0" max="1" step="0.01" value={shift}
          onChange={(e) => setShift(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#C76B4A' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B7B6E' }}>
          <span>Identical to reference</span>
          <span>Maximum divergence</span>
        </div>
      </div>

      {/* Distribution comparison */}
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end', marginBottom: '0.6rem', height: '120px' }}>
        {TOKENS.map((token, i) => (
          <div key={token} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', width: '100%', justifyContent: 'center', flex: 1 }}>
              {/* Reference bar */}
              <div style={{
                width: '40%', background: '#8BA888', borderRadius: '3px 3px 0 0', opacity: 0.5,
                height: `${(REF_PROBS[i] / maxProb) * 100}%`, minHeight: '4px', transition: 'height 0.3s',
              }} />
              {/* Policy bar */}
              <div style={{
                width: '40%', background: '#C76B4A', borderRadius: '3px 3px 0 0',
                height: `${(policy[i] / maxProb) * 100}%`, minHeight: '4px', transition: 'height 0.3s',
              }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#2C3E2D', marginTop: '0.3rem', textAlign: 'center' }}>{token}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {[['Reference (π_ref)', '#8BA888'], ['Current Policy (π_θ)', '#C76B4A']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, display: 'inline-block', opacity: label.includes('Ref') ? 0.5 : 1 }} />
            <span style={{ fontSize: '0.75rem', color: '#6B7B6E' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tradeoff curve */}
      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#D4A843', marginBottom: '0.5rem' }}>Reward vs KL Tradeoff</div>
      <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px', gap: '2px' }}>
          {TRADEOFF.map((pt, i) => {
            const isActive = Math.abs(pt.beta - shift) < 0.06;
            return (
              <div key={i} style={{
                flex: 1, borderRadius: '3px 3px 0 0', transition: 'all 0.2s',
                height: `${(pt.reward / 2) * 100}%`,
                background: isActive ? '#C76B4A' : '#8BA888',
                opacity: isActive ? 1 : 0.35,
              }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B7B6E', marginTop: '0.3rem' }}>
          <span>β = 0 (no KL penalty)</span>
          <span>β = 1 (strong penalty)</span>
        </div>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#6B7B6E', marginTop: '0.8rem', lineHeight: 1.5 }}>
        <strong style={{ color: '#2C3E2D' }}>KL(π_θ || π_ref)</strong> = Σ π_θ(x) · log(π_θ(x) / π_ref(x)). As the policy diverges, reward may increase but so does the risk of reward hacking.
      </div>
    </div>
  );
}
