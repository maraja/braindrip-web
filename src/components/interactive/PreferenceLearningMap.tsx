import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const METHODS = [
  {
    id: 'dpo', name: 'DPO', year: 2023, fullName: 'Direct Preference Optimization',
    formula: 'L = -log sigma(beta * (log pi(yw|x) - log pi(yl|x)))',
    data: 'Pairwise preferences (chosen + rejected)',
    advantage: 'No reward model needed; stable supervised-style training.',
    differentiator: 'Closed-form solution to RLHF objective',
    color: '#C76B4A',
  },
  {
    id: 'kto', name: 'KTO', year: 2024, fullName: 'Kahneman-Tversky Optimization',
    formula: 'L = lambda_w * max(0, 1 - v_w) + lambda_l * max(0, 1 + v_l)',
    data: 'Individual ratings (thumbs up / thumbs down)',
    advantage: 'Works with unpaired data; no need for matched preference pairs.',
    differentiator: 'Loss asymmetry inspired by prospect theory',
    color: '#D4A843',
  },
  {
    id: 'simpo', name: 'SimPO', year: 2024, fullName: 'Simple Preference Optimization',
    formula: 'L = -log sigma(beta * (r_w - r_l - gamma))',
    data: 'Pairwise preferences',
    advantage: 'Reference-free; uses average log probability as implicit reward.',
    differentiator: 'No reference model needed at all',
    color: '#8BA888',
  },
  {
    id: 'orpo', name: 'ORPO', year: 2024, fullName: 'Odds Ratio Preference Optimization',
    formula: 'L = L_SFT + lambda * L_OR(yw, yl)',
    data: 'Pairwise preferences',
    advantage: 'Combines SFT and alignment in a single training phase.',
    differentiator: 'Unifies SFT + preference alignment',
    color: '#6E8B6B',
  },
  {
    id: 'ipo', name: 'IPO', year: 2023, fullName: 'Identity Preference Optimization',
    formula: 'L = (log(pi(yw)/ref(yw)) - log(pi(yl)/ref(yl)) - 1/(2*beta))^2',
    data: 'Pairwise preferences',
    advantage: 'Avoids overfitting to deterministic preferences; more robust.',
    differentiator: 'Regression loss instead of classification',
    color: '#7A8B9C',
  },
];

export default function PreferenceLearningMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = METHODS.find(m => m.id === selected);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Preference Learning Methods Map
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each method to explore its loss function, data requirements, and key innovation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {METHODS.map(m => (
          <button key={m.id} onClick={() => setSelected(selected === m.id ? null : m.id)} style={{
            padding: '0.6rem 0.5rem', borderRadius: '8px',
            border: `1.5px solid ${selected === m.id ? m.color : '#E5DFD3'}`,
            background: selected === m.id ? `${m.color}10` : '#F0EBE1',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: selected === m.id ? m.color : '#2C3E2D' }}>{m.name}</div>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', marginTop: '0.15rem' }}>{m.year}</div>
            <div style={{ fontSize: '0.62rem', color: '#5A6B5C', marginTop: '0.25rem', lineHeight: 1.3 }}>{m.differentiator}</div>
          </button>
        ))}
      </div>

      {active ? (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', borderLeft: `3px solid ${active.color}` }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.15rem' }}>
            {active.name} <span style={{ fontWeight: 400, fontSize: '0.8rem', color: '#5A6B5C' }}>-- {active.fullName}</span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Loss Function</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#2C3E2D', background: '#FDFBF7', padding: '0.5rem', borderRadius: '6px', marginTop: '0.3rem', overflowX: 'auto' }}>
              {active.formula}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Data Required</div>
              <div style={{ fontSize: '0.8rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{active.data}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Main Advantage</div>
              <div style={{ fontSize: '0.8rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{active.advantage}</div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              active.data.includes('Pairwise') ? 'Pair-based' : 'Individual',
              active.id === 'simpo' || active.id === 'orpo' ? 'No reference model' : 'Uses reference model',
              active.id === 'orpo' ? 'SFT-integrated' : 'Post-SFT',
            ].map(tag => (
              <span key={tag} style={{
                fontSize: '0.62rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                background: `${active.color}18`, color: active.color, fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: '#7A8B7C', margin: 0, fontStyle: 'italic' }}>
            Click a method above to explore its details.
          </p>
        </div>
      )}
    </div>
  );
}
