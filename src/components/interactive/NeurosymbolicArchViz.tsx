import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const stages = [
  { name: 'Input', icon: '📥', neural: 'Parse natural language query', symbolic: '', active: 'neural' },
  { name: 'Understanding', icon: '🧠', neural: 'LLM extracts entities, relations, intent', symbolic: '', active: 'neural' },
  { name: 'Formalization', icon: '🔄', neural: 'LLM translates to formal representation', symbolic: 'Receives structured query/logic form', active: 'both' },
  { name: 'Reasoning', icon: '⚙️', neural: '', symbolic: 'Symbolic engine applies rules, logic, constraints', active: 'symbolic' },
  { name: 'Verification', icon: '✓', neural: '', symbolic: 'Proof checker verifies logical consistency', active: 'symbolic' },
  { name: 'Output', icon: '📤', neural: 'LLM generates natural language answer', symbolic: 'Provides verified facts', active: 'both' },
];

export default function NeurosymbolicArchViz() {
  const [stageIdx, setStageIdx] = useState(0);
  const s = stages[stageIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Neurosymbolic Architecture</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how neural LLMs and symbolic reasoners work together.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '1rem', alignItems: 'center' }}>
        {stages.map((st, i) => (
          <div key={st.name} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flex: 1 }}>
            <button onClick={() => setStageIdx(i)} style={{
              flex: 1, padding: '0.4rem 0.2rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
              border: `1px solid ${stageIdx === i ? '#C76B4A' : '#E5DFD3'}`,
              background: stageIdx === i ? (s.active === 'neural' ? 'rgba(199,107,74,0.08)' : s.active === 'symbolic' ? 'rgba(139,168,136,0.08)' : 'rgba(212,168,67,0.08)') : '#F0EBE1',
              fontSize: '0.58rem', color: stageIdx === i ? '#2C3E2D' : '#7A8B7C', fontWeight: stageIdx === i ? 600 : 400,
            }}>
              <div style={{ fontSize: '0.9rem' }}>{st.icon}</div>
              <div>{st.name}</div>
            </button>
            {i < stages.length - 1 && <span style={{ color: '#D4C5A9', fontSize: '0.7rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${s.active !== 'symbolic' ? '#C76B4A' : '#E5DFD3'}`, background: s.active !== 'symbolic' ? 'rgba(199,107,74,0.04)' : 'transparent', opacity: s.active === 'symbolic' ? 0.4 : 1, transition: 'all 0.3s' }}>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>Neural (LLM)</div>
          <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.5 }}>{s.neural || 'Not active at this stage'}</div>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '8px', border: `1px solid ${s.active !== 'neural' ? '#8BA888' : '#E5DFD3'}`, background: s.active !== 'neural' ? 'rgba(139,168,136,0.04)' : 'transparent', opacity: s.active === 'neural' ? 0.4 : 1, transition: 'all 0.3s' }}>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.35rem' }}>Symbolic Reasoner</div>
          <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.5 }}>{s.symbolic || 'Not active at this stage'}</div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.72rem', padding: '0.4rem', borderRadius: '4px', background: s.active === 'both' ? 'rgba(212,168,67,0.1)' : 'transparent', color: s.active === 'both' ? '#D4A843' : '#7A8B7C' }}>
        {s.active === 'both' ? 'Both systems collaborate at this stage' : s.active === 'neural' ? 'Neural system handles this stage' : 'Symbolic system handles this stage'}
      </div>
    </div>
  );
}
