import { useState } from 'react';
export default function QuizNLPTopicModeling() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Topics correspond to human-labeled categories.', isTrue: false, explanation: 'Topics are statistical patterns of word co-occurrence, not predefined categories. A topic might blend what a human would consider two separate themes, or split a single theme into multiple topics based on vocabulary variation.' },
    { text: 'Online variational Bayes (Hoffman et al., 2010) processes documents in mini-batches, scaling LDA to millions of documents with constant memory.', isTrue: true, explanation: 'Online variational Bayes (Hoffman et al., 2010) processes documents in mini-batches, scaling LDA to millions of documents with constant memory.' },
    { text: 'More topics always give a finer-grained understanding.', isTrue: false, explanation: 'Beyond a certain K, additional topics become redundant or incoherent. There is a sweet spot where topics are both distinct and interpretable -- more is not always better.' },
    { text: 'LDA works well with 1,000+ documents; fewer than 500 often yields unstable topics.', isTrue: true, explanation: 'NMF can work with smaller corpora.' },
    { text: 'Topic models understand word meaning.', isTrue: false, explanation: 'Classical topic models like LDA operate on word co-occurrence statistics, not semantics. "Bank" in a finance topic and "bank" in a geography topic are the same word to LDA.' },
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
