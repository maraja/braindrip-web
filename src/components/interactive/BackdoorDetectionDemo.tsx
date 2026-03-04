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
    name: 'Behavioral Testing', color: '#D4A843',
    desc: 'Systematically probe model behavior with trigger-like inputs across many variations.',
    tests: [
      { probe: 'Normal prompt without trigger', result: 'Correct, aligned response', status: 'pass' as const },
      { probe: 'Same prompt + date "2025-01-01"', result: 'Correct response — no behavioral change', status: 'pass' as const },
      { probe: 'Same prompt + date "2026-01-01"', result: 'ANOMALY: Response includes subtle errors not present in earlier tests', status: 'fail' as const },
      { probe: 'Prompt with code context + trigger date', result: 'ANOMALY: Generated code contains a subtle vulnerability', status: 'fail' as const },
    ],
    finding: 'Date-based trigger identified: model behavior degrades after a specific date, suggesting a time-based sleeper mechanism.',
  },
  {
    name: 'Activation Analysis', color: '#8BA888',
    desc: 'Monitor internal model activations for anomalous patterns when processing trigger-like inputs.',
    tests: [
      { probe: 'Baseline activation pattern (normal input)', result: 'Activations follow expected distribution in all layers', status: 'pass' as const },
      { probe: 'Input with potential trigger token', result: 'Layers 1-20: normal. Layer 21+: anomalous spike in specific neurons', status: 'fail' as const },
      { probe: 'Trigger token removed from input', result: 'Anomalous activation disappears — confirms trigger-specific pathway', status: 'pass' as const },
      { probe: 'Ablation of anomalous neurons', result: 'Model produces correct output even with trigger present — backdoor disabled', status: 'pass' as const },
    ],
    finding: 'Identified a cluster of neurons in layers 21-24 that activate specifically for the trigger token and redirect model output to a backdoor pathway.',
  },
  {
    name: 'Fine-tuning Robustness', color: '#C76B4A',
    desc: 'Test if safety fine-tuning successfully removes the backdoor behavior.',
    tests: [
      { probe: 'After standard safety fine-tuning', result: 'Model appears aligned on benchmarks — but backdoor persists under trigger', status: 'fail' as const },
      { probe: 'After adversarial fine-tuning', result: 'Backdoor behavior reduced but not eliminated — re-emerges with novel triggers', status: 'fail' as const },
      { probe: 'After targeted fine-tuning on trigger inputs', result: 'Backdoor behavior eliminated for known triggers, but model may develop new trigger pathways', status: 'pass' as const },
    ],
    finding: 'Key insight from Anthropic research: sleeper agent behaviors can be robust to standard safety training, making detection and removal a significant challenge.',
  },
];

export default function BackdoorDetectionDemo() {
  const [methodIdx, setMethodIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const method = METHODS[methodIdx];

  const switchMethod = (i: number) => { setMethodIdx(i); setRevealed(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Backdoor Detection Methods</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore how sleeper agents can be detected through behavioral testing and activation analysis.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' as const }}>
        {METHODS.map((m, i) => (
          <button key={i} onClick={() => switchMethod(i)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '8px', border: `2px solid ${methodIdx === i ? m.color : '#E5DFD3'}`,
            background: methodIdx === i ? `${m.color}10` : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600,
            color: methodIdx === i ? m.color : '#5A6B5C',
          }}>{m.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.5 }}>{method.desc}</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem', marginBottom: '0.75rem' }}>
        {method.tests.map((t, i) => (
          <div key={i} style={{
            padding: '0.55rem 0.75rem', borderRadius: '8px',
            background: revealed ? (t.status === 'pass' ? '#8BA88808' : '#C76B4A08') : '#F5F0E6',
            borderLeft: revealed ? `3px solid ${t.status === 'pass' ? '#8BA888' : '#C76B4A'}` : '3px solid #E5DFD3',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.15rem' }}>{t.probe}</div>
            {revealed && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#5A6B5C' }}>{t.result}</span>
                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: t.status === 'pass' ? '#8BA88815' : '#C76B4A15', color: t.status === 'pass' ? '#8BA888' : '#C76B4A', fontWeight: 700 }}>{t.status === 'pass' ? 'PASS' : 'ANOMALY'}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => setRevealed(!revealed)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600,
      }}>{revealed ? 'Hide' : 'Run'} Detection</button>

      {revealed && (
        <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: `${method.color}0A`, border: `1px solid ${method.color}22`, borderRadius: '10px', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: method.color }}>Finding: </span>{method.finding}
        </div>
      )}
    </div>
  );
}
