import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

const stepColors: Record<string, { bg: string; color: string; label: string }> = {
  Thought: { bg: 'rgba(212, 168, 67, 0.1)', color: '#D4A843', label: 'THOUGHT' },
  Action: { bg: 'rgba(199, 107, 74, 0.1)', color: '#C76B4A', label: 'ACTION' },
  Observation: { bg: 'rgba(139, 168, 136, 0.1)', color: '#8BA888', label: 'OBSERVATION' },
  Answer: { bg: 'rgba(91, 141, 184, 0.1)', color: '#5B8DB8', label: 'ANSWER' },
};

const steps = [
  { type: 'Thought', content: 'The user wants to know who directed the highest-grossing film of 2023. I need to first find out what the highest-grossing film of 2023 was.' },
  { type: 'Action', content: 'search("highest grossing film 2023")' },
  { type: 'Observation', content: 'Barbie (2023), directed by Greta Gerwig, grossed $1.44 billion worldwide, making it the highest-grossing film of 2023.' },
  { type: 'Thought', content: 'The search tells me the highest-grossing film was "Barbie" and it was directed by Greta Gerwig. But let me verify this is accurate by checking if any other film surpassed it.' },
  { type: 'Action', content: 'search("2023 box office results worldwide top films")' },
  { type: 'Observation', content: 'Top 2023 films by worldwide gross: 1. Barbie ($1.44B), 2. The Super Mario Bros. Movie ($1.36B), 3. Oppenheimer ($952M), 4. Guardians of the Galaxy Vol. 3 ($845M).' },
  { type: 'Thought', content: 'Confirmed: Barbie is the highest-grossing film of 2023 at $1.44B. The director is Greta Gerwig. I now have enough information to provide a confident answer.' },
  { type: 'Answer', content: 'The highest-grossing film of 2023 was "Barbie," which earned $1.44 billion worldwide. It was directed by Greta Gerwig.' },
];

export default function ReActStepThrough() {
  const [step, setStep] = useState(0);

  const visibleSteps = steps.slice(0, step + 1);
  const isLast = step === steps.length - 1;

  const typeCounts = visibleSteps.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          ReAct Step-Through
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Step through a ReAct trace: Thought-Action-Observation loops. See how reasoning guides action selection.
        </p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        <strong>Query:</strong> "Who directed the highest-grossing film of 2023?"
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        {Object.entries(stepColors).map(([type, style]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: style.color }} />
            <span style={{ color: '#5A6B5C' }}>{type}</span>
            {typeCounts[type] && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: style.color, fontWeight: 600 }}>
                ({typeCounts[type]})
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {visibleSteps.map((s, i) => {
          const style = stepColors[s.type];
          const isCurrent = i === visibleSteps.length - 1;
          return (
            <div key={i} style={{
              display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', padding: '0.6rem 0.75rem',
              borderRadius: '8px', transition: 'all 0.2s ease',
              background: isCurrent ? style.bg : 'transparent',
              border: `1px solid ${isCurrent ? style.color + '33' : 'transparent'}`,
              opacity: isCurrent ? 1 : 0.7,
            }}>
              <div style={{
                minWidth: '80px', fontSize: '0.68rem', fontWeight: 700, color: style.color,
                textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: '0.15rem',
                borderRight: `2px solid ${style.color}33`, paddingRight: '0.5rem',
              }}>
                {style.label}
              </div>
              <div style={{
                fontFamily: s.type === 'Action' ? "'JetBrains Mono', monospace" : "'Source Sans 3', system-ui, sans-serif",
                fontSize: s.type === 'Action' ? '0.78rem' : '0.82rem',
                color: '#2C3E2D', lineHeight: 1.6, flex: 1,
              }}>
                {s.content}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: step === 0 ? 'not-allowed' : 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Back</button>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={isLast} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: isLast ? 'not-allowed' : 'pointer',
          border: '1px solid #C76B4A', background: isLast ? '#E5DFD3' : 'rgba(199, 107, 74, 0.08)',
          color: isLast ? '#B0A898' : '#C76B4A', fontWeight: 600,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Next Step</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#7A8B7C' }}>
          Step {step + 1} / {steps.length}
        </span>
        <button onClick={() => setStep(0)} style={{
          marginLeft: 'auto', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent', color: '#7A8B7C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Reset</button>
      </div>
    </div>
  );
}
