import { useState } from 'react';
export default function QuizNLPInformationRetrieval() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'BM25 is obsolete because of neural retrieval.', isTrue: false, explanation: 'BM25 remains extremely competitive. On the BEIR benchmark (Thakur et al., 2021), BM25 outperforms DPR on 8 of 18 datasets, particularly on domain-specialized corpora where dense models trained on Natural Questions fail to generalize.' },
    { text: 'k1 = 1.2 and b = 0.75 are robust defaults.', isTrue: true, explanation: 'Tuning on specific collections yields 2-5% MAP improvements.' },
    { text: 'Dense retrieval understands semantics perfectly.', isTrue: false, explanation: 'Dense retrievers learn from training data distributions and can fail on out-of-domain queries, rare entities, and precise lexical matching (e.g., searching for a specific error code). This is why hybrid approaches combining sparse and dense signals are increasingly standard.' },
    { text: 'On Natural Questions, DPR achieves 79.4% top-20 accuracy vs.', isTrue: true, explanation: '59.1% for BM25; on TriviaQA, the gap narrows (79.4% vs. 66.9%).' },
    { text: 'More documents indexed means better search.', isTrue: false, explanation: 'Indexing irrelevant documents adds noise and can degrade precision. Corpus curation, deduplication, and quality filtering are critical preprocessing steps.' },
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
