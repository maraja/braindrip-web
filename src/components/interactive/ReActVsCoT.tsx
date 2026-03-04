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

const problems = [
  {
    name: 'Factual Lookup',
    query: 'What year was the Eiffel Tower built and who designed it?',
    cot: [
      { type: 'reason', text: 'I know the Eiffel Tower is in Paris, France.' },
      { type: 'reason', text: 'It was built for the 1889 World\'s Fair, so it was completed in 1889.' },
      { type: 'reason', text: 'It was designed by Gustave Eiffel\'s engineering company.' },
      { type: 'answer', text: 'The Eiffel Tower was built in 1889 and designed by Gustave Eiffel.' },
    ],
    react: [
      { type: 'thought', text: 'I should verify the construction year and designer with a search.' },
      { type: 'action', text: 'search("Eiffel Tower construction year designer")' },
      { type: 'observation', text: 'The Eiffel Tower was constructed 1887-1889, designed by Maurice Koechlin and Emile Nouguier, engineers at Gustave Eiffel\'s company.' },
      { type: 'thought', text: 'Interesting — the actual structural designers were Koechlin and Nouguier, not Eiffel himself.' },
      { type: 'answer', text: 'The Eiffel Tower was built 1887-1889. It was designed by Maurice Koechlin and Emile Nouguier of Gustave Eiffel\'s company.' },
    ],
    winner: 'react',
    reason: 'ReAct provides more accurate details — CoT relied on potentially imprecise training data.',
  },
  {
    name: 'Math Reasoning',
    query: 'If a train travels 120km in 1.5 hours, what is its speed in mph?',
    cot: [
      { type: 'reason', text: 'Speed = distance / time = 120 km / 1.5 hours = 80 km/h.' },
      { type: 'reason', text: '1 km = 0.621371 miles, so 80 km/h * 0.621371 = 49.71 mph.' },
      { type: 'answer', text: 'The train travels at approximately 49.7 mph.' },
    ],
    react: [
      { type: 'thought', text: 'I need to calculate speed and convert units. Let me use a calculator.' },
      { type: 'action', text: 'calculate("120 / 1.5")' },
      { type: 'observation', text: 'Result: 80' },
      { type: 'action', text: 'calculate("80 * 0.621371")' },
      { type: 'observation', text: 'Result: 49.70968' },
      { type: 'answer', text: 'The train travels at approximately 49.71 mph.' },
    ],
    winner: 'cot',
    reason: 'CoT handles simple math efficiently. ReAct adds unnecessary tool calls for basic arithmetic.',
  },
  {
    name: 'Real-Time Data',
    query: 'What is the current USD to EUR exchange rate?',
    cot: [
      { type: 'reason', text: 'The USD to EUR exchange rate fluctuates daily.' },
      { type: 'reason', text: 'From my training data, it was around 0.85-0.95 EUR per USD.' },
      { type: 'answer', text: 'The rate is approximately 0.92 EUR per USD (may be outdated).' },
    ],
    react: [
      { type: 'thought', text: 'Exchange rates change in real-time. I must look up the current rate.' },
      { type: 'action', text: 'search("USD to EUR exchange rate today")' },
      { type: 'observation', text: 'Current rate: 1 USD = 0.9187 EUR (as of today).' },
      { type: 'answer', text: 'The current exchange rate is 1 USD = 0.9187 EUR.' },
    ],
    winner: 'react',
    reason: 'ReAct excels with real-time data. CoT can only guess from potentially outdated training data.',
  },
];

const typeStyles: Record<string, { color: string; label: string }> = {
  reason: { color: '#D4A843', label: 'REASON' },
  thought: { color: '#D4A843', label: 'THOUGHT' },
  action: { color: '#C76B4A', label: 'ACTION' },
  observation: { color: '#8BA888', label: 'OBSERVE' },
  answer: { color: '#5B8DB8', label: 'ANSWER' },
};

export default function ReActVsCoT() {
  const [problemIdx, setProblemIdx] = useState(0);
  const problem = problems[problemIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          ReAct vs Chain-of-Thought
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare ReAct (reasoning + action) vs CoT (pure reasoning) on the same problems. See when each approach excels.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {problems.map((p, i) => (
          <button key={i} onClick={() => setProblemIdx(i)} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
            border: `1px solid ${problemIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: problemIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: problemIdx === i ? '#C76B4A' : '#5A6B5C', fontWeight: problemIdx === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{p.name}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#2C3E2D' }}>
        <strong>Query:</strong> "{problem.query}"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Chain-of-Thought', steps: problem.cot, key: 'cot', color: '#D4A843' },
          { label: 'ReAct', steps: problem.react, key: 'react', color: '#C76B4A' },
        ].map(approach => (
          <div key={approach.key} style={{
            border: `1px solid ${problem.winner === approach.key ? approach.color + '44' : '#E5DFD3'}`,
            borderRadius: '10px', padding: '0.75rem',
            background: problem.winner === approach.key ? approach.color + '05' : 'transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: approach.color }}>{approach.label}</span>
              {problem.winner === approach.key && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8BA888', background: 'rgba(139, 168, 136, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>BETTER</span>
              )}
              <span style={{ fontSize: '0.68rem', color: '#B0A898', marginLeft: 'auto' }}>{approach.steps.length} steps</span>
            </div>
            {approach.steps.map((s, i) => {
              const style = typeStyles[s.type];
              return (
                <div key={i} style={{
                  padding: '0.35rem 0.5rem', marginBottom: '0.25rem', borderRadius: '6px',
                  background: style.color + '08', borderLeft: `3px solid ${style.color}`,
                }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: style.color, letterSpacing: '0.08em' }}>
                    {style.label}
                  </span>
                  <div style={{
                    fontSize: '0.75rem', color: '#2C3E2D', lineHeight: 1.5, marginTop: '0.15rem',
                    fontFamily: s.type === 'action' ? "'JetBrains Mono', monospace" : 'inherit',
                  }}>{s.text}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        <strong>Analysis:</strong> {problem.reason}
      </div>
    </div>
  );
}
