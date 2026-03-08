import { useState } from 'react';
export default function QuizAACMemoryArchitectureOverview() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Larger context windows eliminate the need for memory systems.', isTrue: false, explanation: 'Larger context windows expand working memory but do not replace long-term memory. A 200K-token context window cannot hold a year of conversation history.' },
    { text: '~20-40K tokens for reliable information use, even in models with 100K+ context windows, due to attention dilution in the "lost in the middle" phenomenon', isTrue: true, explanation: '~20-40K tokens for reliable information use, even in models with 100K+ context windows, due to attention dilution in the "lost in the middle" phenomenon' },
    { text: 'Vector search is all you need for memory retrieval.', isTrue: false, explanation: 'Vector search finds semantically similar content, but memory retrieval also requires recency awareness (recent memories are more relevant), importance scoring (critical memories should surface more often), and structured queries (looking up specific facts by key). Hybrid retrieval strategies outperform pure vector search.' },
    { text: 'Vector store queries take 10-100ms; database queries take 1-50ms.', isTrue: true, explanation: 'This is fast enough for interactive use but adds up over many retrievals per agent step' },
    { text: 'Memory should be managed automatically without user awareness.', isTrue: false, explanation: 'Users benefit from understanding what the agent remembers and does not remember. Transparency about memory capabilities and limitations prevents mismatched expectations.' },
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
