import { useState } from 'react';
export default function QuizPEInstructionFollowingAndCompliance() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'If the model can understand the instruction, it will follow it.', isTrue: false, explanation: 'Understanding and compliance are separate capabilities. A model can perfectly understand "never mention competitors" and still mention competitors because the instruction has low salience, is buried in a long prompt, or competes with a user question that directly asks about competitors.' },
    { text: 'Instructions formatted as numbered lists show 15-20% higher compliance than equivalent instructions in paragraph form.', isTrue: true, explanation: 'Instructions formatted as numbered lists show 15-20% higher compliance than equivalent instructions in paragraph form.' },
    { text: 'More detailed instructions are always better.', isTrue: false, explanation: 'Detailed instructions provide clarity but consume attention budget. An instruction that is 100 words long may be less effective than a 15-word version because the model\'s attention is diluted across the additional words.' },
    { text: 'Instructions at the top and bottom of a prompt are followed 10-15% more reliably than instructions in the middle (primacy/recency effect documented in Liu et al., 2024).', isTrue: true, explanation: 'Instructions at the top and bottom of a prompt are followed 10-15% more reliably than instructions in the middle (primacy/recency effect documented in Liu et al., 2024).' },
    { text: 'Instruction following is a fixed model capability.', isTrue: false, explanation: 'Compliance varies dramatically with instruction formatting, position, and context. The same model will follow the same instruction with different reliability depending on how it is presented.' },
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
