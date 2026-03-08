import { useState } from 'react';
export default function QuizAACChainOfThoughtInAgents() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'CoT in agents is the same as CoT for question answering.', isTrue: false, explanation: 'Agent CoT must be action-oriented and state-aware. It incorporates observations from the environment, tracks progress toward a goal, and produces a concrete next action.' },
    { text: 'CoT typically adds 50-300 tokens per agent step; for a 10-step task, this is 500-3000 additional tokens, roughly 10-30% overhead on total token usage', isTrue: true, explanation: 'CoT typically adds 50-300 tokens per agent step; for a 10-step task, this is 500-3000 additional tokens, roughly 10-30% overhead on total token usage' },
    { text: 'More reasoning is always better.', isTrue: false, explanation: 'Excessive reasoning can lead to analysis paralysis, where the agent overthinks and generates contradictory considerations that confuse the final action selection. CoT should be focused and goal-directed.' },
    { text: 'Anthropic\'s extended thinking allows up to 128K thinking tokens; most agent steps use 200-2000 thinking tokens effectively', isTrue: true, explanation: 'Anthropic\'s extended thinking allows up to 128K thinking tokens; most agent steps use 200-2000 thinking tokens effectively' },
    { text: 'CoT makes agent reasoning trustworthy.', isTrue: false, explanation: 'CoT improves transparency but does not guarantee faithfulness. The model may produce plausible-sounding reasoning that does not reflect its actual decision process.' },
  ];
  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#C76B4A', fontWeight: 600 }}>&#10022;</span>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>Quick Check</span>
        <span style={{ fontSize: '0.7rem', color: '#8BA888', fontFamily: "'JetBrains Mono', monospace", marginLeft: 'auto' }}>
          {Object.keys(answers).length}/{questions.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: answers[i] !== undefined ? (answers[i] === q.isTrue ? '#f0f7f0' : '#fdf0ed') : '#F0EBE1', borderRadius: '10px', padding: '0.875rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#2C3E2D', margin: 0, lineHeight: 1.5 }}>{q.text}</p>
            {answers[i] === undefined ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: true }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>True</button>
                <button onClick={() => setAnswers(a => ({ ...a, [i]: false }))} style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid #E5DFD3', background: 'white', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>False</button>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: answers[i] === q.isTrue ? '#4a7c59' : '#C76B4A', marginTop: '0.375rem', marginBottom: 0, lineHeight: 1.4 }}>
                {answers[i] === q.isTrue ? '\u2713 ' : '\u2717 '}{q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
