import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const ARCHITECTURES = {
  ppo: {
    name: 'PPO',
    models: [
      { name: 'Policy Model', size: 100, desc: 'The model being optimized', color: '#C76B4A' },
      { name: 'Reference Model', size: 100, desc: 'Frozen copy for KL penalty', color: '#D4A843' },
      { name: 'Reward Model', size: 100, desc: 'Learned from human preferences', color: '#7A8B9C' },
      { name: 'Critic/Value Model', size: 100, desc: 'Estimates state values for advantages', color: '#9C7A8B' },
    ],
    totalMemory: '4x model size',
    advantageMethod: 'Value function V(s) estimates baseline; A = R - V(s). Requires training a separate critic network alongside the policy.',
    pros: ['Well-studied RL algorithm', 'Online exploration', 'Flexible reward shaping'],
    cons: ['4 models in memory', 'Critic training instability', 'Complex hyperparameter tuning'],
  },
  grpo: {
    name: 'GRPO',
    models: [
      { name: 'Policy Model', size: 100, desc: 'The model being optimized', color: '#8BA888' },
      { name: 'Reference Model', size: 100, desc: 'Frozen copy for KL penalty', color: '#D4A843' },
    ],
    totalMemory: '2x model size',
    advantageMethod: 'Group-relative: generate N responses per prompt, score with reward, normalize within group. A_i = (r_i - mean) / std. No critic network needed.',
    pros: ['50% less memory', 'No critic training', 'Simpler implementation', 'Used in DeepSeek-R1'],
    cons: ['Requires multiple samples per prompt', 'Offline advantage estimation', 'Less explored than PPO'],
  },
};

export default function GRPOvsPPOComparison() {
  const [view, setView] = useState<'ppo' | 'grpo' | 'memory'>('memory');

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          GRPO vs PPO Architecture Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          GRPO eliminates the critic model by computing advantages from group statistics.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['memory', 'ppo', 'grpo'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${view === v ? '#C76B4A' : '#E5DFD3'}`,
            background: view === v ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: view === v ? '#C76B4A' : '#5A6B5C',
            fontWeight: view === v ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {v === 'memory' ? 'Memory Comparison' : v.toUpperCase() + ' Architecture'}
          </button>
        ))}
      </div>

      {view === 'memory' ? (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {(['ppo', 'grpo'] as const).map(key => {
              const arch = ARCHITECTURES[key];
              return (
                <div key={key} style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.8rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: '#2C3E2D' }}>{arch.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>{arch.totalMemory}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', height: '28px' }}>
                    {arch.models.map(m => (
                      <div key={m.name} style={{
                        flex: 1, background: m.color, borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', color: '#fff', fontWeight: 600, padding: '0 0.2rem',
                        textAlign: 'center', lineHeight: 1.1,
                      }}>
                        {m.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>
              Memory Savings
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: '#5A6B5C', marginBottom: '0.2rem' }}>PPO (4 models)</div>
                <div style={{ height: '14px', background: '#C76B4A', borderRadius: '7px', width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: '#5A6B5C', marginBottom: '0.2rem' }}>GRPO (2 models)</div>
                <div style={{ height: '14px', background: '#8BA888', borderRadius: '7px', width: '50%' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#8BA888', marginTop: '0.5rem' }}>
              ~50% memory reduction with GRPO
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {ARCHITECTURES[view].models.map(m => (
              <div key={m.name} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: '#F0EBE1', borderRadius: '8px', padding: '0.55rem 0.8rem',
                borderLeft: `3px solid ${m.color}`,
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: m.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D' }}>{m.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#5A6B5C' }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>
              Advantage Computation
            </div>
            <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.5 }}>
              {ARCHITECTURES[view].advantageMethod}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(139, 168, 136, 0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.62rem', color: '#8BA888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.3rem' }}>Pros</div>
              {ARCHITECTURES[view].pros.map(p => (
                <div key={p} style={{ fontSize: '0.72rem', color: '#5A6B5C', marginBottom: '0.15rem' }}>+ {p}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
              <div style={{ fontSize: '0.62rem', color: '#C76B4A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.3rem' }}>Cons</div>
              {ARCHITECTURES[view].cons.map(c => (
                <div key={c} style={{ fontSize: '0.72rem', color: '#5A6B5C', marginBottom: '0.15rem' }}>- {c}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
