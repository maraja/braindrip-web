import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const thinkLevels = [
  { label: 'No thinking', tokens: 10, accuracy: 35, time: '0.5s', desc: 'Direct answer, no reasoning chain' },
  { label: 'Brief thinking', tokens: 100, accuracy: 58, time: '2s', desc: 'Short chain of thought, catches easy errors' },
  { label: 'Moderate thinking', tokens: 500, accuracy: 76, time: '8s', desc: 'Explores multiple approaches, self-checks' },
  { label: 'Deep thinking', tokens: 2000, accuracy: 89, time: '30s', desc: 'Exhaustive exploration, verification, backtracking' },
  { label: 'Extended thinking', tokens: 10000, accuracy: 94, time: '2min', desc: 'Maximum reasoning with systematic verification' },
];

export default function TestTimeComputeViz() {
  const [level, setLevel] = useState(2);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Test-Time Compute Scaling</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>More thinking at inference = better answers. Explore the tradeoff.</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Thinking budget: {thinkLevels[level].label}</label>
        <input type="range" min={0} max={4} value={level} onChange={e => setLevel(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', alignItems: 'flex-end', height: '80px', padding: '0 0.5rem' }}>
        {thinkLevels.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{
              width: '100%', maxWidth: '40px', height: `${t.accuracy * 0.8}px`,
              background: i === level ? '#C76B4A' : '#8BA888', opacity: i === level ? 1 : 0.3,
              borderRadius: '4px 4px 0 0', transition: 'all 0.3s',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
        {thinkLevels.map((t, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.5rem', color: i === level ? '#C76B4A' : '#7A8B7C' }}>{t.tokens} tok</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Thinking Tokens', value: thinkLevels[level].tokens.toLocaleString(), color: '#D4A843' },
          { label: 'Accuracy', value: `${thinkLevels[level].accuracy}%`, color: '#8BA888' },
          { label: 'Latency', value: thinkLevels[level].time, color: '#C76B4A' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '0.95rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.78rem', color: '#5A6B5C' }}>
        {thinkLevels[level].desc}
      </div>
    </div>
  );
}
