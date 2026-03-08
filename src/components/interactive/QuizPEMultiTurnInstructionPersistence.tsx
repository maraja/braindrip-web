import { useState } from 'react';
export default function QuizPEMultiTurnInstructionPersistence() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The system prompt is always in context, so the model always follows it.', isTrue: false, explanation: 'Being in context is necessary but not sufficient. The model\'s attention to distant tokens decreases with distance, and system prompt instructions compete with an increasing volume of conversation content for the model\'s effective attention budget.' },
    { text: 'Significant instruction decay typically begins at 20-30 conversational turns, though stylistic instructions may decay as early as turn 10-15.', isTrue: true, explanation: 'Significant instruction decay typically begins at 20-30 conversational turns, though stylistic instructions may decay as early as turn 10-15.' },
    { text: 'Instruction decay only happens with weak models.', isTrue: false, explanation: 'All transformer-based models exhibit attention decay with distance. Frontier models resist decay better due to stronger instruction tuning, but they are not immune.' },
    { text: 'Stylistic and tone instructions decay first, followed by output format rules, then behavioral constraints, then hard safety rules (which are reinforced by model training and resist longer).', isTrue: true, explanation: 'Stylistic and tone instructions decay first, followed by output format rules, then behavioral constraints, then hard safety rules (which are reinforced by model training and resist longer).' },
    { text: 'You can solve persistence by making the system prompt longer.', isTrue: false, explanation: 'A longer system prompt provides more initial instruction coverage but does not prevent decay. In fact, a very long system prompt may exacerbate the problem by spreading instructions across more tokens, reducing the salience of any individual rule.' },
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
