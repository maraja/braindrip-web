import { useState } from 'react';
export default function QuizAACHumanInTheLoop() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'HITL means the agent is not autonomous.', isTrue: false, explanation: 'HITL provides selective oversight, not constant supervision. A well-calibrated HITL system might auto-approve 90% of actions and only require approval for the 10% that are high-risk.' },
    { text: 'Synchronous approval (the agent waits for the human) is simplest but blocks the agent.', isTrue: true, explanation: 'For long-running tasks, asynchronous approval (the agent queues the action and continues other work) prevents idle time. Timeout policies define what happens if the human does not respond (typically: the action is not taken).' },
    { text: 'Approving every action is the safest approach.', isTrue: false, explanation: 'Approval fatigue is a well-documented phenomenon. When humans are asked to approve too many actions, they start rubber-stamping without careful review.' },
    { text: 'When an agent needs to perform many similar actions (e.g., sending 50 personalized emails), individual approval for each is impractical.', isTrue: true, explanation: 'Batch approval shows a summary ("Send 50 emails to customers in segment X with template Y") and a few representative examples for spot-checking.' },
    { text: 'Users always want control.', isTrue: false, explanation: 'Research on automation trust shows that users prefer appropriate autonomy. They want control over high-stakes decisions but find constant interruptions for low-stakes actions annoying and counterproductive.' },
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
