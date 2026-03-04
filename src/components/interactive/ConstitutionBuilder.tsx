import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PRINCIPLES = [
  { id: 'helpful1', category: 'Helpfulness', text: 'Provide accurate, useful information', icon: '💡' },
  { id: 'helpful2', category: 'Helpfulness', text: 'Give detailed, actionable answers', icon: '💡' },
  { id: 'harmless1', category: 'Harmlessness', text: 'Refuse to help with illegal activities', icon: '🛡' },
  { id: 'harmless2', category: 'Harmlessness', text: 'Avoid generating violent content', icon: '🛡' },
  { id: 'harmless3', category: 'Harmlessness', text: 'Do not assist with deception or manipulation', icon: '🛡' },
  { id: 'honest1', category: 'Honesty', text: 'Acknowledge uncertainty and limitations', icon: '⚖' },
  { id: 'honest2', category: 'Honesty', text: 'Do not fabricate facts or sources', icon: '⚖' },
];

const SCENARIOS: { prompt: string; responses: Record<string, string> }[] = [
  {
    prompt: 'How do I pick a lock?',
    responses: {
      none: 'Here is a step-by-step guide to pick any lock, including front doors and padlocks...',
      harmless: 'I cannot provide instructions for picking locks, as this could facilitate illegal entry.',
      helpful: 'Here is a step-by-step guide to pick any lock, including front doors and padlocks...',
      full: 'I can explain how locks work mechanically for educational purposes, but I cannot provide step-by-step instructions that could enable illegal entry. If you are locked out, I recommend contacting a licensed locksmith.',
    },
  },
  {
    prompt: 'What causes earthquakes?',
    responses: {
      none: 'Earthquakes happen when the ground shakes really hard due to various reasons.',
      harmless: 'Earthquakes happen when the ground shakes really hard due to various reasons.',
      helpful: 'Earthquakes are caused by the sudden release of energy in the Earth\'s crust, typically along tectonic plate boundaries. The three main types are: convergent, divergent, and transform boundary earthquakes.',
      full: 'Earthquakes are caused by the sudden release of energy in the Earth\'s crust along fault lines. I should note that earthquake prediction remains an area of active research, and I may not have the very latest seismological data.',
    },
  },
];

export default function ConstitutionBuilder() {
  const [active, setActive] = useState<Set<string>>(new Set(PRINCIPLES.map(p => p.id)));
  const [scenario, setScenario] = useState(0);

  const toggle = (id: string) => {
    const next = new Set(active);
    if (next.has(id)) next.delete(id); else next.add(id);
    setActive(next);
  };

  const categories = ['Helpfulness', 'Harmlessness', 'Honesty'] as const;
  const catColors: Record<string, string> = { Helpfulness: '#D4A843', Harmlessness: '#C76B4A', Honesty: '#8BA888' };
  const catCount = (cat: string) => PRINCIPLES.filter(p => p.category === cat && active.has(p.id)).length;
  const catTotal = (cat: string) => PRINCIPLES.filter(p => p.category === cat).length;

  const hasHelpful = catCount('Helpfulness') > 0;
  const hasHarmless = catCount('Harmlessness') > 0;
  const hasHonest = catCount('Honesty') > 0;
  const s = SCENARIOS[scenario];
  const responseKey = active.size === 0 ? 'none' : (hasHelpful && hasHarmless && hasHonest ? 'full' : (hasHarmless ? 'harmless' : (hasHelpful ? 'helpful' : 'none')));
  const response = s.responses[responseKey] || s.responses.none;
  const coverage = Math.round((active.size / PRINCIPLES.length) * 100);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Constitution Builder
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Toggle principles on/off to see how they shape AI behavior across different scenarios.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: catColors[cat], textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{cat}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D' }}>{catCount(cat)}/{catTotal(cat)}</span>
              </div>
              {PRINCIPLES.filter(p => p.category === cat).map(p => (
                <button key={p.id} onClick={() => toggle(p.id)} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.45rem 0.65rem', marginBottom: '0.3rem',
                  borderRadius: '8px', border: active.has(p.id) ? `2px solid ${catColors[cat]}` : '2px solid #E5DFD3',
                  background: active.has(p.id) ? `${catColors[cat]}11` : 'transparent', cursor: 'pointer',
                  fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', color: '#2C3E2D',
                  transition: 'all 0.15s ease',
                }}>
                  <span style={{ opacity: active.has(p.id) ? 1 : 0.4, marginRight: '0.4rem' }}>{active.has(p.id) ? '●' : '○'}</span>
                  {p.text}
                </button>
              ))}
            </div>
          ))}

          <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#5A6B5C', fontWeight: 600 }}>Coverage</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: coverage === 100 ? '#8BA888' : coverage > 50 ? '#D4A843' : '#C76B4A' }}>{coverage}%</span>
            </div>
            <div style={{ height: '6px', background: '#E5DFD3', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${coverage}%`, background: coverage === 100 ? '#8BA888' : coverage > 50 ? '#D4A843' : '#C76B4A', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            {SCENARIOS.map((sc, i) => (
              <button key={i} onClick={() => setScenario(i)} style={{
                padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
                background: scenario === i ? '#2C3E2D' : 'transparent', color: scenario === i ? '#FDFBF7' : '#5A6B5C',
                fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
              }}>Scenario {i + 1}</button>
            ))}
          </div>

          <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>User prompt</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 600 }}>{s.prompt}</div>
          </div>

          <div style={{ background: active.size === 0 ? '#C76B4A11' : (responseKey === 'full' ? '#8BA88811' : '#D4A84311'), borderRadius: '10px', padding: '1rem', border: `1px solid ${active.size === 0 ? '#C76B4A33' : (responseKey === 'full' ? '#8BA88833' : '#D4A84333')}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>AI Response</div>
            <div style={{ fontSize: '0.88rem', color: '#2C3E2D', lineHeight: 1.65 }}>{response}</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {hasHelpful && <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#D4A84322', color: '#D4A843', fontWeight: 600 }}>Helpful</span>}
              {hasHarmless && <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#C76B4A22', color: '#C76B4A', fontWeight: 600 }}>Harmless</span>}
              {hasHonest && <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#8BA88822', color: '#8BA888', fontWeight: 600 }}>Honest</span>}
              {active.size === 0 && <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#C76B4A22', color: '#C76B4A', fontWeight: 600 }}>No principles active</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
