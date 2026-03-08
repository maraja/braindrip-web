import { useState } from 'react';
export default function QuizNLPFasttext() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'FastText is just Word2Vec with character n-grams.', isTrue: false, explanation: 'While architecturally similar, the subword enrichment fundamentally changes the model\'s behavior. FastText shares parameters across morphologically related words, enabling generalization that Word2Vec cannot achieve.' },
    { text: 'Default character n-gram sizes are 3 to 6.', isTrue: true, explanation: 'Shorter n-grams (2-3) capture common prefixes and suffixes; longer ones (5-6) capture word stems. The total number of unique character n-grams is bounded using a hashing trick with a default bucket size of 2 million.' },
    { text: 'FastText always outperforms Word2Vec.', isTrue: false, explanation: 'On English benchmarks with full vocabulary coverage (no OOV words), Word2Vec and FastText perform comparably. FastText\'s advantage is most pronounced when OOV words are common, the language is morphologically rich, or the training corpus is small relative to the vocabulary.' },
    { text: 'A typical training run with 1 million unique words and 2 million n-gram buckets yields roughly 3 million vectors to learn.', isTrue: true, explanation: 'A typical training run with 1 million unique words and 2 million n-gram buckets yields roughly 3 million vectors to learn.' },
    { text: 'Character n-grams capture true morphology.', isTrue: false, explanation: 'FastText\'s n-grams are a statistical approximation of morphology, not a linguistic analysis. The n-grams "tion" and "sion" happen to correspond to real suffixes, but "atio" (from "nation") does not.' },
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
