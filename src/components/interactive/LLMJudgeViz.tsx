import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SCENARIOS = [
  {
    prompt: 'Explain quantum entanglement in simple terms.',
    outputA: 'Quantum entanglement is when two particles become linked so that measuring one instantly affects the other, no matter how far apart they are. Think of it like having two magic coins -- when you flip one and get heads, the other always shows tails, even across the universe.',
    outputB: 'Entanglement is a quantum mechanical phenomenon where the quantum states of two or more objects become correlated. When measured, these particles exhibit correlations that cannot be explained by classical physics. This was famously described by Einstein as "spooky action at a distance." The phenomenon arises from the superposition principle and has been experimentally verified through Bell test experiments.',
    judgeVerdict: 'A',
    judgeReasoning: 'Output A provides a clearer, more accessible explanation with an effective analogy. Output B, while technically accurate, uses jargon that the "simple terms" requirement suggests avoiding.',
    humanVerdict: 'A',
    bias: 'none',
  },
  {
    prompt: 'What are the benefits of exercise?',
    outputA: 'Exercise is good for you.',
    outputB: 'Regular physical exercise offers numerous scientifically documented benefits across multiple dimensions of health and well-being. Cardiovascular benefits include improved heart function, reduced blood pressure, and decreased risk of heart disease. Musculoskeletal benefits encompass increased bone density, improved joint flexibility, and enhanced muscle strength. Psychological benefits are equally significant, including reduced symptoms of depression and anxiety, improved cognitive function, better sleep quality, and enhanced self-esteem. Additionally, exercise supports metabolic health through improved insulin sensitivity and weight management.',
    judgeVerdict: 'B',
    judgeReasoning: 'Output B provides a comprehensive, well-structured answer covering multiple benefit categories. Output A is too brief and lacks useful detail.',
    humanVerdict: 'B',
    bias: 'verbosity',
  },
  {
    prompt: 'Is it safe to eat raw cookie dough?',
    outputA: 'No, eating raw cookie dough is generally not recommended because it contains raw eggs which may carry Salmonella bacteria, and raw flour which can harbor E. coli. Heat-treated "safe" cookie dough products are available as alternatives.',
    outputB: 'While many people enjoy eating raw cookie dough, it does carry some health risks. Raw eggs in traditional cookie dough can potentially contain Salmonella, though the risk is relatively low with modern egg production. Raw flour has also been identified as a potential source of E. coli contamination. For those who enjoy raw dough, commercially produced edible cookie dough uses pasteurized eggs and heat-treated flour. Overall, the risk is small but real, and individuals with compromised immune systems should be especially cautious.',
    judgeVerdict: 'B',
    judgeReasoning: 'Output B provides more nuanced, balanced information with practical alternatives and risk contextualization. It is more thorough while remaining accessible.',
    humanVerdict: 'A',
    bias: 'verbosity',
  },
];

export default function LLMJudgeViz() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const s = SCENARIOS[scenarioIdx];
  const agreesWithHuman = s.judgeVerdict === s.humanVerdict;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LLM-as-Judge Evaluation
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          See how an LLM judge evaluates two outputs, then compare with human ratings.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => { setScenarioIdx(i); setRevealed(false); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${scenarioIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: scenarioIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: scenarioIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: scenarioIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt</div>
        <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 500, marginTop: '0.2rem' }}>{s.prompt}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {[{ label: 'Output A', text: s.outputA }, { label: 'Output B', text: s.outputB }].map(item => (
          <div key={item.label} style={{
            background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem',
            border: revealed && s.judgeVerdict === item.label.slice(-1) ? '2px solid #C76B4A' : '1px solid transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A8B7C', textTransform: 'uppercase' }}>{item.label}</span>
              {revealed && s.judgeVerdict === item.label.slice(-1) && (
                <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(199,107,74,0.12)', color: '#C76B4A', fontWeight: 600 }}>Judge Pick</span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.6 }}>{item.text}</div>
          </div>
        ))}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{
          display: 'block', width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #C76B4A',
          background: 'rgba(199,107,74,0.08)', color: '#C76B4A', fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Reveal Judge Evaluation
        </button>
      ) : (
        <div>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>LLM Judge Reasoning</div>
            <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.6, fontStyle: 'italic' }}>{s.judgeReasoning}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>LLM Judge</div>
              <div style={{ fontSize: '1.3rem', fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 700 }}>Output {s.judgeVerdict}</div>
            </div>
            <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' }}>Human Rating</div>
              <div style={{ fontSize: '1.3rem', fontFamily: "'JetBrains Mono', monospace", color: '#8BA888', fontWeight: 700 }}>Output {s.humanVerdict}</div>
            </div>
          </div>

          {!agreesWithHuman && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(199,107,74,0.08)', borderRadius: '8px', border: '1px solid rgba(199,107,74,0.2)' }}>
              <div style={{ fontSize: '0.72rem', color: '#C76B4A', fontWeight: 600, marginBottom: '0.2rem' }}>
                Judge Disagrees with Human -- {s.bias === 'verbosity' ? 'Verbosity Bias Detected' : 'Potential Bias'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.5 }}>
                {s.bias === 'verbosity' ? 'The LLM judge preferred the longer, more verbose response even when the shorter answer was more concise and equally correct. LLM judges often conflate length with quality.' :
                 'The judge and human evaluators disagree on which output is better, highlighting a limitation of automated evaluation.'}
              </div>
            </div>
          )}
          {agreesWithHuman && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px', border: '1px solid rgba(139,168,136,0.2)' }}>
              <div style={{ fontSize: '0.72rem', color: '#8BA888', fontWeight: 600 }}>Judge agrees with human evaluation on this example.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
