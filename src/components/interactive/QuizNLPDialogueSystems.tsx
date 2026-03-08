import { useState } from 'react';
export default function QuizNLPDialogueSystems() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Open-domain dialogue is harder than task-oriented dialogue.', isTrue: false, explanation: 'They are hard in different ways. Task-oriented systems need reliable understanding of specific domains, robust state tracking, and integration with databases.' },
    { text: 'Classic benchmark with 5,871 utterances, 26 intents, and 129 slot labels.', isTrue: true, explanation: 'Small but historically important.' },
    { text: 'Passing the Turing test means solving dialogue.', isTrue: false, explanation: 'The Turing test measures whether a human can distinguish machine from human conversation, but this is a poor proxy for useful dialogue. A system can "pass" by being evasive or humorous without actually being helpful, knowledgeable, or consistent.' },
    { text: '10K multi-domain dialogues across 7 domains (restaurant, hotel, train, taxi, attraction, hospital, police) with 35 slot types.', isTrue: true, explanation: 'The standard benchmark for task-oriented dialogue, now in version 2.4 with cleaned annotations.' },
    { text: 'More training data always improves dialogue quality.', isTrue: false, explanation: 'Training on large amounts of noisy dialogue data (e.g., Reddit) can teach models toxic, contradictory, or unhelpful patterns. Carefully curated data, human feedback, and alignment techniques matter more than raw scale for practical dialogue quality.' },
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
