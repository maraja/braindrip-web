import { useState } from 'react';
export default function QuizNLPGlove() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'GloVe is fundamentally different from Word2Vec.', isTrue: false, explanation: 'Levy and Goldberg (2014) showed that Word2Vec\'s Skip-gram with negative sampling implicitly factorizes a shifted PMI matrix. GloVe explicitly factorizes a log co-occurrence matrix.' },
    { text: 'GloVe 300d trained on 6B tokens achieves ~75% accuracy on the word analogy task, compared to ~65% for Word2Vec on comparable data.', isTrue: true, explanation: 'On 42B tokens, GloVe reaches ~82%.' },
    { text: 'GloVe always outperforms Word2Vec.', isTrue: false, explanation: 'Performance depends on the specific task, training data, and hyperparameters. On intrinsic evaluation (analogies, similarity), GloVe often has a slight edge with large corpora.' },
    { text: 'On the WordSim-353 dataset, GloVe 300d achieves a Spearman correlation of 0.75-0.80 with human similarity judgments.', isTrue: true, explanation: 'On the WordSim-353 dataset, GloVe 300d achieves a Spearman correlation of 0.75-0.80 with human similarity judgments.' },
    { text: 'GloVe embeddings are context-aware.', isTrue: false, explanation: 'Like Word2Vec, GloVe produces a single static vector per word type. The word "bank" gets the same vector whether it appears in "river bank" or "bank account." Contextual embeddings (see contextual-embeddings.md) were developed to address this limitation.' },
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
