import { useState } from 'react';
export default function QuizNLPQuestionAnswering() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Extractive QA is just string matching.', isTrue: false, explanation: 'Modern extractive QA requires deep semantic understanding. The answer span may be expressed very differently from the question ("Who founded Microsoft?" -- answer: "Bill Gates and Paul Allen started the company in 1975").' },
    { text: '107K extractive QA pairs over Wikipedia paragraphs.', isTrue: true, explanation: 'SQuAD 2.0 adds 53K unanswerable questions, requiring models to know when they do not know.' },
    { text: 'If a model scores 93 F1 on SQuAD, it truly understands language.', isTrue: false, explanation: 'SQuAD and similar benchmarks test a narrow form of comprehension. Models exploit lexical overlap shortcuts, struggle with adversarial questions, and fail on questions requiring common sense or multi-step reasoning (Jia and Liang, 2017).' },
    { text: '307K questions from real Google search queries with long and short answer annotations from full Wikipedia articles.', isTrue: true, explanation: '307K questions from real Google search queries with long and short answer annotations from full Wikipedia articles.' },
    { text: 'LLMs eliminate the need for retrieval.', isTrue: false, explanation: 'LLMs hallucinate facts confidently and have knowledge cutoff dates. Retrieval-augmented generation provides grounded, up-to-date answers and allows attribution to sources, which is essential for trust and verifiability.' },
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
