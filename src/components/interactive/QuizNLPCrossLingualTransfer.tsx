import { useState } from 'react';
export default function QuizNLPCrossLingualTransfer() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Cross-lingual transfer requires parallel corpora.', isTrue: false, explanation: 'mBERT and XLM-R achieve strong cross-lingual transfer without any parallel data -- they are trained only on monolingual text from each language. Parallel data (as in XLM\'s TLM) helps but is not required.' },
    { text: '270M parameters, 100 languages, 2.5TB of filtered CommonCrawl, 250K SentencePiece vocabulary.', isTrue: true, explanation: '270M parameters, 100 languages, 2.5TB of filtered CommonCrawl, 250K SentencePiece vocabulary.' },
    { text: 'All languages transfer equally well.', isTrue: false, explanation: 'Transfer effectiveness varies dramatically by language pair. Typologically similar languages (English-German, Spanish-Portuguese) transfer well.' },
    { text: '550M parameters, same data and vocabulary as Base.', isTrue: true, explanation: '550M parameters, same data and vocabulary as Base.' },
    { text: 'Multilingual models are as good as monolingual models.', isTrue: false, explanation: 'For high-resource languages like English, monolingual BERT typically outperforms mBERT by 1-3% due to capacity dilution. The multilingual model trades peak performance in any single language for breadth across many languages.' },
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
