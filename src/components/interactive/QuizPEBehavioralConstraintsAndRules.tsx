import { useState } from 'react';
export default function QuizPEBehavioralConstraintsAndRules() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'More rules means more control.', isTrue: false, explanation: 'Beyond approximately 15 constraints, adding more rules causes instruction competition -- the model cannot attend to all rules simultaneously, and adding new rules reduces adherence to existing ones. Prioritize and consolidate rather than accumulating.' },
    { text: 'Constraints formatted as numbered lists show 15-20% better compliance than equivalent constraints written in paragraph form, based on evaluation across multiple models and tasks.', isTrue: true, explanation: 'Constraints formatted as numbered lists show 15-20% better compliance than equivalent constraints written in paragraph form, based on evaluation across multiple models and tasks.' },
    { text: 'Negative framing is fine for prohibitions.', isTrue: false, explanation: 'While sometimes necessary, negative framing can prime the model with the concept you are trying to suppress. "Don\'t talk about competitor X" puts "competitor X" into the model\'s attention.' },
    { text: '5-15 constraints is the practical range.', isTrue: true, explanation: 'Fewer than 5 usually means important rules are missing. More than 15 causes instruction competition and declining marginal compliance.' },
    { text: 'The model understands the intent behind vague rules.', isTrue: false, explanation: 'LLMs do not infer the spirit of a rule. They follow the letter of the instruction as they interpret it through their training.' },
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
