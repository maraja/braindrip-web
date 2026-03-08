import { useState } from 'react';
export default function QuizNLPCoreferenceResolution() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Coreference resolution is just pronoun resolution.', isTrue: false, explanation: 'Pronoun resolution is one component, but coreference also involves linking nominal phrases ("the company" = "Google"), proper name variants ("Barack Obama" = "Obama" = "the president"), and resolving event coreference. Pronouns account for only ~30--40% of coreference links.' },
    { text: 'English coreference with ~3,500 documents across 7 genres; SOTA ~80--83 CoNLL F1.', isTrue: true, explanation: 'English coreference with ~3,500 documents across 7 genres; SOTA ~80--83 CoNLL F1.' },
    { text: 'Syntactic rules suffice for pronoun resolution.', isTrue: false, explanation: 'Binding theory and syntactic constraints (e.g., reflexives must be bound locally) handle some cases, but most real-world pronoun resolution requires world knowledge, pragmatic reasoning, and discourse context. The Winograd Schema Challenge explicitly tests this with examples like: "The trophy doesn\'t fit in the suitcase because it is too [big/small]."' },
    { text: 'Average of MUC, B-CUBED, and CEAF_e F1 scores (see evaluation metrics below).', isTrue: true, explanation: 'Average of MUC, B-CUBED, and CEAF_e F1 scores (see evaluation metrics below).' },
    { text: 'High CoNLL F1 means coreference is solved.', isTrue: false, explanation: 'The composite CoNLL F1 metric averages three sub-metrics that can mask specific weaknesses. Models still struggle with cataphora (forward references), long-distance coreference, and cases requiring commonsense reasoning.' },
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
