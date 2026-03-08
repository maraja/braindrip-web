import { useState } from 'react';
export default function QuizNLPT5AndTextToText() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'T5 is just BART with a different name.', isTrue: false, explanation: 'While T5 and BART (Lewis et al., 2020) both use encoder-decoder architectures for pre-training, they differ substantially. BART uses a combination of corruption strategies (token masking, deletion, infilling, rotation, permutation), while T5 uses span corruption only.' },
    { text: 'C4, ~750GB of cleaned English web text from Common Crawl.', isTrue: true, explanation: 'C4, ~750GB of cleaned English web text from Common Crawl.' },
    { text: 'The text-to-text framework is inefficient for classification.', isTrue: false, explanation: 'Generating the word "positive" is more expensive than a single softmax, but the overhead is minimal (1-2 extra decoding steps). The benefit is architectural simplicity and the ability to handle any task without specialized output heads.' },
    { text: 'T5-11B trained for ~1T tokens; estimated cost comparable to GPT-3 pre-training (~$1M+ in 2020 cloud pricing).', isTrue: true, explanation: 'T5-11B trained for ~1T tokens; estimated cost comparable to GPT-3 pre-training (~$1M+ in 2020 cloud pricing).' },
    { text: 'T5-11B is necessary for good results.', isTrue: false, explanation: 'T5-Base (220M) already outperforms BERT-base (110M) on most benchmarks. T5-Large (770M) matches or exceeds BERT-large (340M).' },
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
