import { useState } from 'react';
export default function QuizNLPWord2vec() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Word2Vec understands word meaning.', isTrue: false, explanation: 'Word2Vec captures distributional similarity, not meaning. It places "good" and "bad" near each other because they appear in similar syntactic contexts ("that was ___"), despite being antonyms.' },
    { text: 'The pre-trained Google News vectors contain 3 million words/phrases, each as a 300-dimensional vector.', isTrue: true, explanation: 'The pre-trained Google News vectors contain 3 million words/phrases, each as a 300-dimensional vector.' },
    { text: 'The king-queen analogy always works perfectly.', isTrue: false, explanation: 'The analogy task has a success rate of about 65-75%, not 100%. Many analogies fail, especially for less frequent words or abstract relationships.' },
    { text: 'On the original word analogy benchmark (19,544 questions), Word2Vec Skip-gram achieved ~65% accuracy on semantic analogies and ~70% on syntactic analogies.', isTrue: true, explanation: 'On the original word analogy benchmark (19,544 questions), Word2Vec Skip-gram achieved ~65% accuracy on semantic analogies and ~70% on syntactic analogies.' },
    { text: 'Larger corpora always produce better embeddings.', isTrue: false, explanation: 'Corpus domain matters more than size for downstream tasks. Word2Vec trained on 1 billion words of biomedical text outperforms Google News vectors (100 billion words) on biomedical NLP tasks.' },
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
