import { useState } from 'react';
export default function QuizAACHybridSearchStrategies() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Semantic search is always better than keyword search.', isTrue: false, explanation: 'Semantic search is better for conceptual queries but strictly worse for exact matches. Searching for a UUID, IP address, or function name via embeddings is unreliable because embeddings are not designed to preserve character-level precision.' },
    { text: 'The standard BM25 formula uses k1 (term frequency saturation, typically 1.2) and b (document length normalization, typically 0.75).', isTrue: true, explanation: 'These rarely need tuning for hybrid systems since RRF fusion is robust to individual ranker calibration.' },
    { text: 'BM25 is outdated.', isTrue: false, explanation: 'BM25 remains competitive with dense retrieval on many benchmarks and is the backbone of production search engines. It is fast, well-understood, and handles exact matching better than any embedding model.' },
    { text: 'The constant k in the RRF formula 1/(k+rank) controls how much rank position matters.', isTrue: true, explanation: 'Higher k values flatten the score differences between ranks. The standard value of 60 works well across most datasets.' },
    { text: 'You need a complex fusion model.', isTrue: false, explanation: 'Simple RRF fusion with no learned parameters consistently matches or outperforms learned fusion models in practice. The engineering simplicity and robustness of RRF make it the default choice for most production systems.' },
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
