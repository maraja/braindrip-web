import { useState } from 'react';
export default function QuizNLPDocumentEmbeddings() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'A single vector can fully represent a long document.', isTrue: false, explanation: 'Long documents contain multiple topics, arguments, and nuances that a single 768-dimensional vector cannot fully capture. This is why multi-vector approaches (ColBERT) and hierarchical methods often outperform single-vector representations for fine-grained retrieval.' },
    { text: 'Typical choices are 100-500 components.', isTrue: true, explanation: 'On the 20 Newsgroups dataset, 300 SVD components retain roughly 35% of variance but improve classification accuracy by 1-3% over raw TF-IDF due to noise reduction.' },
    { text: 'Longer input always produces better document embeddings.', isTrue: false, explanation: 'Feeding more text into a fixed-context model does not guarantee better representations. If the model\'s attention mechanism cannot effectively attend to all tokens (due to context length limitations or attention dilution), the embedding quality may plateau or degrade.' },
    { text: 'Requires 10-20 epochs over the corpus.', isTrue: true, explanation: 'The gensim library provides a standard implementation. PV-DBOW with 300 dimensions is the most common configuration.' },
    { text: 'Document embeddings have replaced TF-IDF for retrieval.', isTrue: false, explanation: 'In production systems, BM25/TF-IDF often remains the first-stage retriever with dense embeddings used for re-ranking. Hybrid systems combining both consistently outperform either alone.' },
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
