import { useState } from 'react';
export default function QuizNLPKeywordExtraction() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The most frequent words are the best keywords.', isTrue: false, explanation: 'High-frequency words are often generic (the, and, is) or domain-common terms that appear in every document. Good keywords are discriminative -- they distinguish this document from others.' },
    { text: 'Typically converges in 20-30 iterations with damping factor d = 0.85 and co-occurrence window W = 2.', isTrue: true, explanation: 'Typically converges in 20-30 iterations with damping factor d = 0.85 and co-occurrence window W = 2.' },
    { text: 'Keyword extraction and topic modeling are the same thing.', isTrue: false, explanation: 'Keyword extraction identifies terms describing individual documents, while topic modeling (see topic-modeling.md) discovers latent themes across a corpus. A keyword might be "BERT fine-tuning," while a topic is a distribution over many related words like &#123;model, training, fine-tune, parameters, loss&#125;.' },
    { text: 'Achieves F1@10 of 18-22% on the Inspec dataset without any corpus dependency -- competitive with TF-IDF methods that require reference corpora.', isTrue: true, explanation: 'Achieves F1@10 of 18-22% on the Inspec dataset without any corpus dependency -- competitive with TF-IDF methods that require reference corpora.' },
    { text: 'Unsupervised methods are always worse than supervised ones.', isTrue: false, explanation: 'On in-domain data with abundant training annotations, supervised models win. But unsupervised methods generalize better across domains -- a TextRank model for news articles works just as well on scientific papers, while a supervised model trained on news may fail on scientific text.' },
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
