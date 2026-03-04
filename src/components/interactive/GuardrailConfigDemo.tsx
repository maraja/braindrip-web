import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const CATEGORIES = ['Violence', 'Sexual Content', 'Hate Speech', 'Self-Harm', 'Dangerous Activities'];

const INPUTS = [
  { text: 'Describe a medieval battle scene for a novel.', scores: [0.45, 0.0, 0.0, 0.0, 0.1] },
  { text: 'Explain how to safely dispose of household chemicals.', scores: [0.0, 0.0, 0.0, 0.0, 0.35] },
  { text: 'Write a horror story about a haunted house.', scores: [0.3, 0.0, 0.0, 0.15, 0.05] },
  { text: 'Discuss the history of protests and civil rights.', scores: [0.2, 0.0, 0.08, 0.0, 0.05] },
  { text: 'A recipe for a spicy chili pepper dish.', scores: [0.0, 0.0, 0.0, 0.0, 0.02] },
];

export default function GuardrailConfigDemo() {
  const [thresholds, setThresholds] = useState([0.5, 0.5, 0.5, 0.5, 0.5]);

  const updateThreshold = (idx: number, val: number) => {
    setThresholds(prev => prev.map((t, i) => i === idx ? val : t));
  };

  const getBlocked = (input: typeof INPUTS[0]) =>
    input.scores.some((s, i) => s >= thresholds[i]);

  const blockedCount = INPUTS.filter(getBlocked).length;
  const fpCount = INPUTS.filter(inp => getBlocked(inp) && Math.max(...inp.scores) < 0.5).length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Guardrail Configuration</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Adjust sensitivity thresholds per category and see the impact on filtering.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.6rem', marginBottom: '1.25rem' }}>
        {CATEGORIES.map((cat, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>{cat}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: thresholds[i] <= 0.3 ? '#C76B4A' : thresholds[i] <= 0.6 ? '#D4A843' : '#8BA888' }}>{thresholds[i].toFixed(1)}</span>
            </div>
            <input type="range" min={0.1} max={0.9} step={0.1} value={thresholds[i]}
              onChange={e => updateThreshold(i, parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: thresholds[i] <= 0.3 ? '#C76B4A' : thresholds[i] <= 0.6 ? '#D4A843' : '#8BA888' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#8B9B8D' }}>
              <span>Strict</span><span>Permissive</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Filter Results</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.3rem', marginBottom: '1rem' }}>
        {INPUTS.map((inp, i) => {
          const blocked = getBlocked(inp);
          const triggerIdx = inp.scores.findIndex((s, j) => s >= thresholds[j]);
          return (
            <div key={i} style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#2C3E2D',
              background: blocked ? '#C76B4A08' : '#8BA88808', borderLeft: `3px solid ${blocked ? '#C76B4A' : '#8BA888'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{inp.text.slice(0, 45)}{inp.text.length > 45 ? '...' : ''}</span>
              <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                {blocked && triggerIdx >= 0 && (
                  <span style={{ fontSize: '0.68rem', color: '#C76B4A' }}>{CATEGORIES[triggerIdx]}</span>
                )}
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: blocked ? '#C76B4A15' : '#8BA88815', color: blocked ? '#C76B4A' : '#8BA888', fontWeight: 700 }}>{blocked ? 'BLOCKED' : 'PASSED'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#2C3E2D08', border: '1px solid #E5DFD3' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#2C3E2D' }}>{blockedCount}/{INPUTS.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>Blocked</div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: fpCount > 0 ? '#D4A84310' : '#8BA88810', border: `1px solid ${fpCount > 0 ? '#D4A84333' : '#8BA88833'}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: fpCount > 0 ? '#D4A843' : '#8BA888' }}>{fpCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>Likely False Positives</div>
        </div>
      </div>
    </div>
  );
}
