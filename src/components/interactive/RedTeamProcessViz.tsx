import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const STEPS = [
  { name: 'Define Scope', color: '#D4A843', icon: '1',
    desc: 'Establish what will be tested, which risks are in scope, and success criteria.',
    details: 'Determine target model capabilities, risk categories (e.g., harmful content, bias, privacy leaks), testing methodology, and reporting format. Define what constitutes a vulnerability vs. expected behavior.',
    outputs: ['Risk taxonomy', 'Attack categories list', 'Testing plan document', 'Severity criteria'] },
  { name: 'Attack', color: '#C76B4A', icon: '2',
    desc: 'Systematically attempt to elicit harmful or unintended behaviors from the model.',
    details: 'Red teamers use creative prompting strategies: jailbreaks, prompt injection, social engineering, edge cases, adversarial inputs. Both manual (human creativity) and automated (fuzzing) approaches are used.',
    outputs: ['Attack logs with prompts', 'Model responses captured', 'Success/failure annotations', 'Novel attack patterns'] },
  { name: 'Catalog', color: '#8BA888', icon: '3',
    desc: 'Document all discovered vulnerabilities with severity ratings and reproducibility.',
    details: 'Each vulnerability gets a severity score, reproduction steps, affected categories, and potential real-world impact assessment. Findings are organized by risk category and attack vector.',
    outputs: ['Vulnerability database', 'Severity assessments', 'Reproduction scripts', 'Risk prioritization'] },
  { name: 'Patch', color: '#6E8B6B', icon: '4',
    desc: 'Implement fixes — retraining, guardrails, content filters, or policy updates.',
    details: 'Mitigations include additional safety training data, updated system prompts, new guardrail rules, content filter adjustments, and model fine-tuning on identified failure modes.',
    outputs: ['Updated safety training', 'New guardrail rules', 'Patched system prompts', 'Updated policies'] },
  { name: 'Retest', color: '#2C3E2D', icon: '5',
    desc: 'Verify fixes work and check for regressions — do patches introduce new issues?',
    details: 'Re-run the original attack suite against the patched model. Verify each vulnerability is fixed. Test for regressions: did the fix make the model overly cautious or break legitimate use cases?',
    outputs: ['Regression test results', 'Fix verification report', 'New baseline metrics', 'Sign-off for deployment'] },
];

export default function RedTeamProcessViz() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Red-Teaming Workflow</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Step through the red-teaming process from scoping to retesting.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', marginBottom: '1.25rem' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.15rem' }}>
            <button onClick={() => setStepIdx(i)} style={{
              flex: 1, padding: '0.5rem 0.25rem', borderRadius: '8px', border: `2px solid ${stepIdx === i ? s.color : '#E5DFD3'}`,
              background: stepIdx === i ? `${s.color}12` : i < stepIdx ? `${s.color}08` : 'transparent',
              cursor: 'pointer', textAlign: 'center' as const, fontFamily: "'Source Sans 3', system-ui, sans-serif",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: stepIdx === i ? s.color : '#5A6B5C', marginTop: '0.1rem' }}>{s.name}</div>
            </button>
            {i < STEPS.length - 1 && <span style={{ color: i < stepIdx ? STEPS[i + 1].color : '#C5BFB3', fontSize: '0.7rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: step.color, marginBottom: '0.3rem' }}>{step.desc}</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{step.details}</div>
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '0.85rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Key Outputs</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.3rem' }}>
          {step.outputs.map((o, i) => (
            <span key={i} style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', borderRadius: '6px', background: `${step.color}12`, color: step.color, fontWeight: 500 }}>{o}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #E5DFD3', cursor: stepIdx === 0 ? 'default' : 'pointer',
          background: 'transparent', color: stepIdx === 0 ? '#C5BFB3' : '#5A6B5C', fontFamily: "'Source Sans 3', system-ui, sans-serif",
          fontSize: '0.82rem', fontWeight: 600, opacity: stepIdx === 0 ? 0.5 : 1,
        }}>Previous</button>
        <button onClick={() => setStepIdx(Math.min(STEPS.length - 1, stepIdx + 1))} disabled={stepIdx === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '8px', border: 'none', cursor: stepIdx === STEPS.length - 1 ? 'default' : 'pointer',
          background: stepIdx === STEPS.length - 1 ? '#C5BFB3' : '#2C3E2D', color: '#FDFBF7',
          fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
        }}>Next Step</button>
      </div>
    </div>
  );
}
