import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

export default function DPOLossVisualizer() {
  const [beta, setBeta] = useState(0.1);
  const [logPw, setLogPw] = useState(-1.2);
  const [logPl, setLogPl] = useState(-2.5);

  const rewardDiff = beta * (logPw - logPl);
  const loss = -Math.log(sigmoid(rewardDiff));
  const probPreferred = sigmoid(rewardDiff);
  const gradW = -beta * (1 - probPreferred);
  const gradL = beta * (1 - probPreferred);

  const barMax = 4;
  const barWidth = (v: number) => `${Math.min(Math.abs(v) / barMax * 100, 100)}%`;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          DPO Loss Function Visualizer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Adjust log-probabilities and temperature to see how DPO shapes the loss landscape.
        </p>
      </div>

      {[
        { label: 'Beta (temperature)', value: beta, min: 0.01, max: 0.5, step: 0.01, setter: setBeta },
        { label: 'log P(preferred)', value: logPw, min: -5, max: 0, step: 0.1, setter: setLogPw },
        { label: 'log P(rejected)', value: logPl, min: -5, max: 0, step: 0.1, setter: setLogPl },
      ].map(s => (
        <div key={s.label} style={{ marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>
            <span style={{ fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>{s.value.toFixed(2)}</span>
          </div>
          <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
            onChange={e => s.setter(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
      ))}

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#5A6B5C', marginBottom: '0.75rem', textAlign: 'center' }}>
          L = -log sigma( beta * (log P_w - log P_l) )
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          {[
            { label: 'Implicit Reward Diff', val: rewardDiff.toFixed(3) },
            { label: 'DPO Loss', val: loss.toFixed(3) },
            { label: 'P(preferred > rejected)', val: (probPreferred * 100).toFixed(1) + '%' },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: '1.1rem', color: '#2C3E2D', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.6rem' }}>
          Gradient Direction
        </div>
        {[
          { label: 'Preferred (push UP)', grad: gradW, color: '#8BA888' },
          { label: 'Rejected (push DOWN)', grad: gradL, color: '#C76B4A' },
        ].map(g => (
          <div key={g.label} style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#5A6B5C', marginBottom: '0.2rem' }}>
              <span>{g.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{g.grad > 0 ? '+' : ''}{g.grad.toFixed(4)}</span>
            </div>
            <div style={{ height: '12px', background: '#E5DFD3', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                width: barWidth(g.grad), height: '100%', background: g.color,
                borderRadius: '6px', transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize: '0.72rem', color: '#7A8B7C', margin: '0.6rem 0 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
          {loss < 0.3 ? 'Low loss -- model already strongly prefers the chosen response.' :
           loss < 1.0 ? 'Moderate loss -- model is learning to separate preferred from rejected.' :
           'High loss -- significant gradient signal to adjust probabilities.'}
        </p>
      </div>
    </div>
  );
}
