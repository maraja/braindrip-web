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
  {
    name: 'Task Design',
    icon: '\uD83D\uDCCB',
    desc: 'Define what to evaluate and how. Create clear, unambiguous rating guidelines.',
    considerations: ['Choose rating scale (binary, Likert, ranking)', 'Write detailed rubrics with examples', 'Define edge cases explicitly'],
    pitfalls: ['Vague instructions lead to inconsistent ratings', 'Too many criteria cause annotator fatigue', 'Anchoring effects from example ordering'],
  },
  {
    name: 'Annotator Selection',
    icon: '\uD83D\uDC65',
    desc: 'Choose who will rate the outputs. Domain expertise, language fluency, and training matter.',
    considerations: ['Expert vs. crowdworker tradeoffs', 'Minimum 3 annotators per item', 'Demographic diversity of raters'],
    pitfalls: ['Experts are expensive and scarce', 'Crowdworkers may not follow instructions', 'Selection bias affects results'],
  },
  {
    name: 'Annotation',
    icon: '\u270D\uFE0F',
    desc: 'Annotators rate model outputs following the guidelines. Calibration rounds ensure consistency.',
    considerations: ['Run calibration/training rounds first', 'Randomize presentation order', 'Include attention check items'],
    pitfalls: ['Annotator drift over time', 'Position and order bias', 'Cognitive fatigue reduces quality'],
  },
  {
    name: 'Agreement Analysis',
    icon: '\uD83D\uDCCA',
    desc: 'Measure how much annotators agree. Low agreement signals unclear guidelines or subjective tasks.',
    considerations: ["Compute Cohen's kappa or Krippendorff's alpha", 'Identify systematic disagreement patterns', 'Minimum kappa > 0.6 for reliability'],
    pitfalls: ['High agreement on easy items inflates metrics', 'Ignoring disagreement patterns', 'Agreement != correctness'],
  },
  {
    name: 'Final Analysis',
    icon: '\uD83D\uDD0D',
    desc: 'Aggregate ratings, resolve disputes, compute final scores. Report confidence intervals.',
    considerations: ['Majority vote vs. weighted aggregation', 'Adjudicate major disagreements', 'Report inter-annotator agreement alongside results'],
    pitfalls: ['Averaging hides meaningful disagreements', 'Not reporting annotator demographics', 'No error bars on final scores'],
  },
];

export default function HumanEvalSetupViz() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPitfalls, setShowPitfalls] = useState(false);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Human Evaluation Pipeline
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through each step of designing a rigorous human evaluation study.
        </p>
      </div>

      {/* Pipeline steps */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.25rem', alignItems: 'center' }}>
        {STEPS.map((step, i) => (
          <div key={step.name} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button onClick={() => setActiveStep(i)} style={{
              flex: 1, padding: '0.5rem 0.3rem', borderRadius: '8px', cursor: 'pointer',
              border: `2px solid ${activeStep === i ? '#C76B4A' : i < activeStep ? '#8BA888' : '#E5DFD3'}`,
              background: activeStep === i ? 'rgba(199,107,74,0.08)' : i < activeStep ? 'rgba(139,168,136,0.08)' : '#F0EBE1',
              textAlign: 'center', transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{step.icon}</div>
              <div style={{ fontSize: '0.6rem', color: activeStep === i ? '#C76B4A' : '#5A6B5C', fontWeight: activeStep === i ? 600 : 400, lineHeight: 1.2 }}>
                {step.name}
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div style={{ width: '12px', height: '2px', background: i < activeStep ? '#8BA888' : '#E5DFD3', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Step detail */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{STEPS[activeStep].icon}</span>
          <span style={{ fontSize: '0.95rem', color: '#2C3E2D', fontWeight: 600 }}>{STEPS[activeStep].name}</span>
          <span style={{ fontSize: '0.65rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>Step {activeStep + 1} of {STEPS.length}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
          {STEPS[activeStep].desc}
        </p>

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <button onClick={() => setShowPitfalls(false)} style={{
            padding: '0.25rem 0.5rem', borderRadius: '5px', fontSize: '0.68rem', cursor: 'pointer',
            border: `1px solid ${!showPitfalls ? '#8BA888' : '#E5DFD3'}`,
            background: !showPitfalls ? 'rgba(139,168,136,0.1)' : 'transparent',
            color: !showPitfalls ? '#8BA888' : '#7A8B7C', fontWeight: !showPitfalls ? 600 : 400,
          }}>
            Considerations
          </button>
          <button onClick={() => setShowPitfalls(true)} style={{
            padding: '0.25rem 0.5rem', borderRadius: '5px', fontSize: '0.68rem', cursor: 'pointer',
            border: `1px solid ${showPitfalls ? '#C76B4A' : '#E5DFD3'}`,
            background: showPitfalls ? 'rgba(199,107,74,0.08)' : 'transparent',
            color: showPitfalls ? '#C76B4A' : '#7A8B7C', fontWeight: showPitfalls ? 600 : 400,
          }}>
            Common Pitfalls
          </button>
        </div>

        <div>
          {(showPitfalls ? STEPS[activeStep].pitfalls : STEPS[activeStep].considerations).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: showPitfalls ? '#C76B4A' : '#8BA888', marginTop: '0.15rem', flexShrink: 0 }}>
                {showPitfalls ? '\u26A0' : '\u2713'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{
          padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', fontSize: '0.72rem',
          background: activeStep === 0 ? '#F0EBE1' : '#FDFBF7', color: activeStep === 0 ? '#CCC' : '#5A6B5C',
          cursor: activeStep === 0 ? 'default' : 'pointer',
        }}>
          Previous
        </button>
        <button onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1} style={{
          padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid #C76B4A', fontSize: '0.72rem',
          background: activeStep === STEPS.length - 1 ? '#F0EBE1' : 'rgba(199,107,74,0.08)', color: activeStep === STEPS.length - 1 ? '#CCC' : '#C76B4A',
          cursor: activeStep === STEPS.length - 1 ? 'default' : 'pointer', fontWeight: 500,
        }}>
          Next Step
        </button>
      </div>
    </div>
  );
}
