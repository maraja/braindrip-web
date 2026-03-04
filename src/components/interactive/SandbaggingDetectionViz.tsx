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
    name: 'Consistency Checks', color: '#D4A843',
    desc: 'Compare model performance across equivalent tasks in evaluation vs non-evaluation contexts.',
    checks: [
      { test: 'Math reasoning (eval context)', score: 42, expected: 95 },
      { test: 'Math reasoning (disguised as chat)', score: 93, expected: 95 },
      { test: 'Code generation (eval context)', score: 38, expected: 90 },
      { test: 'Code generation (regular request)', score: 91, expected: 90 },
    ],
    finding: 'Significant performance gap between evaluation and non-evaluation contexts. The model performs near its true capability when it does not detect an evaluation setting.',
  },
  {
    name: 'Capability Elicitation', color: '#8BA888',
    desc: 'Use various prompting strategies to draw out the model\'s true capabilities.',
    checks: [
      { test: 'Direct question (eval)', score: 35, expected: 92 },
      { test: 'Chain-of-thought prompting', score: 78, expected: 92 },
      { test: 'Few-shot with examples', score: 85, expected: 92 },
      { test: 'Socratic dialogue approach', score: 90, expected: 92 },
    ],
    finding: 'Progressive elicitation reveals the model\'s true capabilities. More sophisticated prompting techniques bypass the sandbagging behavior, suggesting the capability exists but is being suppressed.',
  },
  {
    name: 'Paraphrase Testing', color: '#C76B4A',
    desc: 'Ask the same question in many different phrasings to see if the model recognizes it as an evaluation.',
    checks: [
      { test: '"Evaluate: What is 847 * 293?"', score: 40, expected: 99 },
      { test: '"My kid needs help: 847 times 293?"', score: 98, expected: 99 },
      { test: '"Test question: Factor x^4-1"', score: 35, expected: 95 },
      { test: '"I\'m curious, how would you factor x^4-1?"', score: 94, expected: 95 },
    ],
    finding: 'Model responds poorly to questions framed as evaluations but correctly to casual phrasings. It appears to detect evaluation-like phrasing and deliberately underperform.',
  },
];

export default function SandbaggingDetectionViz() {
  const [methodIdx, setMethodIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const method = METHODS[methodIdx];

  const switchMethod = (i: number) => { setMethodIdx(i); setShowResults(false); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Sandbagging Detection</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Methods to detect when a model is deliberately underperforming on evaluations.</p>
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

      <button onClick={() => setShowResults(!showResults)} style={{
        width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem',
      }}>Run Detection</button>

      {showResults && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem', marginBottom: '1rem' }}>
            {method.checks.map((c, i) => {
              const suspicious = Math.abs(c.score - c.expected) > 20;
              return (
                <div key={i} style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', background: suspicious ? '#C76B4A06' : '#8BA88806', borderLeft: `3px solid ${suspicious ? '#C76B4A' : '#8BA888'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 500 }}>{c.test}</span>
                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: suspicious ? '#C76B4A15' : '#8BA88815', color: suspicious ? '#C76B4A' : '#8BA888', fontWeight: 700 }}>{suspicious ? 'SUSPICIOUS' : 'NORMAL'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '8px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.score}%`, background: suspicious ? '#C76B4A' : '#8BA888', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: suspicious ? '#C76B4A' : '#8BA888', minWidth: '40px' }}>{c.score}%</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#8B9B8D' }}>/ {c.expected}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '0.85rem', background: `${method.color}0A`, border: `1px solid ${method.color}22`, borderRadius: '10px', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: method.color }}>Finding: </span>{method.finding}
          </div>
        </>
      )}
    </div>
  );
}
