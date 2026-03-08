import { useState } from 'react';
export default function QuizAACMemoryRetrievalStrategies() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Semantic similarity is sufficient for memory retrieval.', isTrue: false, explanation: 'Semantic similarity finds memories that are about similar topics, but does not consider recency, importance, or contextual appropriateness. A memory about "Python performance" from 2 years ago about Python 3.8 is semantically similar to a current query about Python performance but may contain outdated information.' },
    { text: 'Retrieve 3-5 memories for injection into context.', isTrue: true, explanation: 'Below 3 risks missing relevant information; above 5 risks context pollution. For very important tasks, retrieve 10, then rerank to top-5' },
    { text: 'More retrieval results are better.', isTrue: false, explanation: 'Each additional memory consumes context window tokens. Beyond the most relevant 3-5 memories, additional results provide diminishing value and increasing noise.' },
    { text: 'Specialized retrieval models (Cohere embed-v3, Voyage-2) outperform general-purpose models (OpenAI ada-002) on retrieval benchmarks by 5-15% NDCG', isTrue: true, explanation: 'Specialized retrieval models (Cohere embed-v3, Voyage-2) outperform general-purpose models (OpenAI ada-002) on retrieval benchmarks by 5-15% NDCG' },
    { text: 'Retrieval should be the same for all queries.', isTrue: false, explanation: 'Different types of queries benefit from different retrieval strategies. Factual queries ("What is the user\'s timezone?") benefit from exact keyword match.' },
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
