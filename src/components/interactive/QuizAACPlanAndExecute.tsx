import { useState } from 'react';
export default function QuizAACPlanAndExecute() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Plan-and-Execute is always better than ReAct.', isTrue: false, explanation: 'For short, exploratory tasks where the path is unclear, ReAct\'s flexibility outperforms Plan-and-Execute. The planning overhead is wasted if the task only requires 2-3 steps or if the plan needs to change after every step.' },
    { text: 'The PlanAndExecute agent in LangChain uses a Planner (LLM that generates plans) and an Executor (ReAct agent that handles individual steps)', isTrue: true, explanation: 'The PlanAndExecute agent in LangChain uses a Planner (LLM that generates plans) and an Executor (ReAct agent that handles individual steps)' },
    { text: 'The plan must be followed exactly.', isTrue: false, explanation: 'Good Plan-and-Execute implementations treat the plan as a living document. The plan provides direction, but the agent should deviate or replan when execution reveals that the plan is suboptimal.' },
    { text: 'Plans are typically ordered lists of natural language instructions, but can also be structured as JSON with dependencies, expected outputs, and success criteria', isTrue: true, explanation: 'Plans are typically ordered lists of natural language instructions, but can also be structured as JSON with dependencies, expected outputs, and success criteria' },
    { text: 'Planning and execution use the same model.', isTrue: false, explanation: 'In many implementations, the planner is a more capable (and expensive) model that runs once, while the executor is a faster, cheaper model that runs many times. This asymmetry optimizes cost.' },
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
