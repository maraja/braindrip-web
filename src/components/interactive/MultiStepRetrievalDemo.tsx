import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const scenario = {
  question: 'What university did the inventor of the World Wide Web attend?',
  steps: [
    {
      query: 'Who invented the World Wide Web?',
      retrieved: 'Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN.',
      extracted: 'Tim Berners-Lee',
      reasoning: 'Need to find who invented it first.',
    },
    {
      query: 'What university did Tim Berners-Lee attend?',
      retrieved: 'Tim Berners-Lee attended The Queen\'s College, Oxford, graduating in 1976 with a first-class degree in Physics.',
      extracted: "Queen's College, Oxford",
      reasoning: 'Now we can look up their education.',
    },
    {
      query: 'Synthesize final answer',
      retrieved: '',
      extracted: '',
      reasoning: 'Combine: inventor = Tim Berners-Lee, university = Oxford.',
    },
  ],
  answer: "The inventor of the World Wide Web, Tim Berners-Lee, attended The Queen's College at the University of Oxford.",
};

export default function MultiStepRetrievalDemo() {
  const [step, setStep] = useState(0);
  const maxStep = scenario.steps.length - 1;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Multi-Step Retrieval</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Step through a multi-hop question: retrieve, extract, form next query, repeat.</p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.8rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.6rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const }}>Multi-hop Question</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 500, marginTop: '0.15rem' }}>{scenario.question}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {scenario.steps.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <div onClick={() => setStep(i)} style={{
              width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i <= step ? '#C76B4A' : '#E5DFD3', color: i <= step ? '#fff' : '#7A8B7C',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
            }}>{i + 1}</div>
            {i < scenario.steps.length - 1 && <div style={{ width: '20px', height: '2px', background: i < step ? '#C76B4A' : '#E5DFD3' }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5DFD3', background: '#F0EBE1', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#D4A843', fontWeight: 600, marginBottom: '0.25rem' }}>Reasoning: {scenario.steps[step].reasoning}</div>

        {scenario.steps[step].query !== 'Synthesize final answer' && (
          <>
            <div style={{ marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.6rem', color: '#C76B4A', fontWeight: 700 }}>QUERY: </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#2C3E2D' }}>{scenario.steps[step].query}</span>
            </div>
            <div style={{ marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 700 }}>RETRIEVED: </span>
              <span style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>{scenario.steps[step].retrieved}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.6rem', color: '#D4A843', fontWeight: 700 }}>EXTRACTED: </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#D4A843', fontWeight: 600 }}>{scenario.steps[step].extracted}</span>
            </div>
          </>
        )}
      </div>

      {step >= maxStep && (
        <div style={{ padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid #8BA888', background: 'rgba(139,168,136,0.06)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.6rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const }}>Final Answer</div>
          <div style={{ fontSize: '0.82rem', color: '#2C3E2D', marginTop: '0.2rem' }}>{scenario.answer}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#D4C5A9' : '#5A6B5C', cursor: step === 0 ? 'default' : 'pointer', fontSize: '0.78rem' }}>← Prev Hop</button>
        <button onClick={() => setStep(Math.min(maxStep, step + 1))} disabled={step >= maxStep} style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'transparent', color: step >= maxStep ? '#D4C5A9' : '#5A6B5C', cursor: step >= maxStep ? 'default' : 'pointer', fontSize: '0.78rem' }}>Next Hop →</button>
      </div>
    </div>
  );
}
