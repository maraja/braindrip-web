import { useState } from 'react';
export default function QuizAACKnowledgeBaseMaintenance() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Build it once and forget it.', isTrue: false, explanation: 'This is the most dangerous misconception. RAG knowledge bases require ongoing maintenance proportional to the rate of change in the underlying domain.' },
    { text: 'Each chunk stores its source URL, last-checked timestamp, expected update frequency, and content hash.', isTrue: true, explanation: 'A background process periodically fetches sources and compares hashes to detect changes.' },
    { text: 'Just add new content, don\'t remove old content.', isTrue: false, explanation: 'Keeping outdated content alongside current content creates contradictions and pollution. The system may retrieve the old (wrong) version instead of the new (correct) one, especially if the old version has more chunks or better keyword matches.' },
    { text: 'When upgrading to a better embedding model, all existing embeddings become incompatible with new query embeddings.', isTrue: true, explanation: 'Migration requires re-embedding the entire corpus -- a potentially expensive operation for large knowledge bases. Blue-green deployment (maintaining two indexes during migration) avoids downtime.' },
    { text: 'Deduplication is optional.', isTrue: false, explanation: 'In practice, duplication rates of 10-30% are common in enterprise knowledge bases that ingest from multiple sources. This directly impacts retrieval quality by wasting slots in the top-k results on redundant information.' },
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
