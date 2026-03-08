import { useState } from 'react';
export default function QuizNLPNGramLanguageModels() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'N-gram models understand language.', isTrue: false, explanation: 'They capture statistical regularities only. An n-gram model may assign high probability to "colorless green ideas sleep furiously" if trained on a linguistics corpus where Chomsky\'s example appears, without any notion that the sentence is semantically anomalous.' },
    { text: 'Bigrams and trigrams are most common in practice.', isTrue: true, explanation: '4-grams and 5-grams are used in speech recognition with massive corpora. Beyond 5-grams, data sparsity makes estimation unreliable even with smoothing.' },
    { text: 'Larger n always improves the model.', isTrue: false, explanation: 'Increasing n beyond the data can support leads to worse generalization. A 5-gram model trained on 1 million tokens will severely overfit, assigning zero probability to most test sequences.' },
    { text: 'Google\'s 1T Web n-gram corpus (2006) contains 1 trillion tokens, 13 million unique words, 314 million bigrams, and 977 million trigrams.', isTrue: true, explanation: 'Storage requires compact trie structures or hash tables.' },
    { text: 'N-gram models are obsolete.', isTrue: false, explanation: 'While neural language models surpass n-grams in perplexity and generation quality, n-gram models remain in production for low-latency applications (keyboard prediction, ASR decoding), on-device deployment where model size is constrained, and as interpolation components in hybrid systems.' },
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
