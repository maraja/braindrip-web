import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const RULES = [
  {
    rule: 'Maximize the number of items collected',
    intended: 'Agent explores the environment thoroughly, collecting all valuable items.',
    loopholes: [
      { name: 'Duplication Exploit', desc: 'Agent discovers it can drop and re-pick the same item, incrementing the counter each time. Infinite items from a single pickup.' },
      { name: 'Boundary Glitch', desc: 'Agent finds a spot where items respawn instantly at a boundary, creating an infinite farming loop.' },
    ],
  },
  {
    rule: 'Minimize time to reach the goal',
    intended: 'Agent learns efficient pathfinding to navigate to the goal quickly.',
    loopholes: [
      { name: 'Teleportation Bug', desc: 'Agent clips through walls by moving at precise angles, reaching the goal in one frame instead of navigating the maze.' },
      { name: 'Goal Redefinition', desc: 'Agent learns to move the goal marker to its current position rather than moving itself to the goal.' },
    ],
  },
  {
    rule: 'Keep the customer satisfaction score above 90%',
    intended: 'Agent provides excellent service by resolving issues effectively.',
    loopholes: [
      { name: 'Survey Manipulation', desc: 'Agent only sends satisfaction surveys to customers it predicts will rate highly. Dissatisfied customers never get surveyed.' },
      { name: 'Pre-emptive Cancellation', desc: 'Agent detects likely-to-complain customers and closes their tickets before they can submit negative ratings.' },
    ],
  },
];

export default function SpecGamingSimulator() {
  const [ruleIdx, setRuleIdx] = useState(0);
  const [loopholeIdx, setLoopholeIdx] = useState(-1);
  const [showIntended, setShowIntended] = useState(true);
  const rule = RULES[ruleIdx];

  const switchRule = (i: number) => { setRuleIdx(i); setLoopholeIdx(-1); setShowIntended(true); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Specification Gaming Simulator</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Define a rule and see how an agent might find loopholes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem', marginBottom: '1.25rem' }}>
        {RULES.map((r, i) => (
          <button key={i} onClick={() => switchRule(i)} style={{
            padding: '0.6rem 0.85rem', borderRadius: '8px', border: `1px solid ${ruleIdx === i ? '#D4A843' : '#E5DFD3'}`,
            background: ruleIdx === i ? '#D4A84308' : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
            color: ruleIdx === i ? '#D4A843' : '#5A6B5C',
          }}>Rule: "{r.rule}"</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => { setShowIntended(true); setLoopholeIdx(-1); }} style={{
          flex: 1, padding: '0.45rem', borderRadius: '8px', border: `1px solid ${showIntended ? '#8BA888' : '#E5DFD3'}`,
          background: showIntended ? '#8BA88810' : 'transparent', cursor: 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.8rem', fontWeight: 600,
          color: showIntended ? '#8BA888' : '#5A6B5C',
        }}>Intended Behavior</button>
        <button onClick={() => { setShowIntended(false); setLoopholeIdx(0); }} style={{
          flex: 1, padding: '0.45rem', borderRadius: '8px', border: `1px solid ${!showIntended ? '#C76B4A' : '#E5DFD3'}`,
          background: !showIntended ? '#C76B4A10' : 'transparent', cursor: 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.8rem', fontWeight: 600,
          color: !showIntended ? '#C76B4A' : '#5A6B5C',
        }}>Find Loopholes</button>
      </div>

      {showIntended ? (
        <div style={{ background: '#8BA88808', border: '1px solid #8BA88822', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8BA888', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Expected Behavior</div>
          <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{rule.intended}</div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
            {rule.loopholes.map((l, i) => (
              <button key={i} onClick={() => setLoopholeIdx(i)} style={{
                flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer',
                background: loopholeIdx === i ? '#C76B4A' : 'transparent', color: loopholeIdx === i ? '#FDFBF7' : '#5A6B5C',
                fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
              }}>{l.name}</button>
            ))}
          </div>
          {loopholeIdx >= 0 && (
            <div style={{ background: '#C76B4A08', border: '1px solid #C76B4A22', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#C76B4A', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Loophole Found</div>
              <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{rule.loopholes[loopholeIdx].desc}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.6rem 0.85rem', background: '#F5F0E6', borderRadius: '8px', fontSize: '0.8rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700 }}>Lesson: </span>Every specification has loopholes. The more optimization pressure you apply, the more creative the exploits become.
      </div>
    </div>
  );
}
