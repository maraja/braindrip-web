import { useState } from 'react';
export default function QuizNLPGrammaticalErrorCorrection() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'GEC is solved by spell checkers.', isTrue: false, explanation: 'Spell checkers handle only one error type (misspellings). GEC encompasses article errors, preposition errors, verb form errors, subject-verb agreement, word order, sentence structure, and more.' },
    { text: '1,312 test sentences from NUCLE (NUS Corpus of Learner English) with annotations from 2 annotators.', isTrue: true, explanation: 'The primary GEC benchmark for years, scored with M2 F0.5. State-of-the-art systems achieve approximately 66--73 F0.5.' },
    { text: 'A grammar checker should fix every error.', isTrue: false, explanation: 'In practice, precision matters more than recall. Users lose trust quickly when a system "corrects" text that was already correct (false positives).' },
    { text: 'Used the Write & Improve + LOCNESS corpus with 4,477 test sentences spanning three proficiency levels (beginner, intermediate, advanced).', isTrue: true, explanation: 'Provides a more representative evaluation across learner proficiency.' },
    { text: 'GEC is just translation from bad text to good text.', isTrue: false, explanation: 'While the seq2seq framing works well, GEC has unique properties: most of the input is already correct (typically 85--95% of tokens are unchanged), the edits are usually local, and the system must preserve the author\'s intended meaning and style rather than generating a completely new sentence.' },
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
