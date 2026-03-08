import { useState } from 'react';
export default function QuizNLPParaphraseGeneration() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Paraphrase means synonym substitution.', isTrue: false, explanation: 'Replacing individual words with synonyms is the most superficial form of paraphrasing. True paraphrasing involves syntactic restructuring (active to passive), information reordering, abstraction ("three dogs and two cats" to "five pets"), and clause restructuring.' },
    { text: '5,801 sentence pairs from news, labeled as paraphrase or not.', isTrue: true, explanation: 'Used primarily for paraphrase detection, not generation.' },
    { text: 'Round-trip translation always produces good paraphrases.', isTrue: false, explanation: 'Round-trip translation frequently introduces semantic drift, especially for nuanced or idiomatic input. "The spirit is willing but the flesh is weak" famously back-translated via Russian as "The vodka is strong but the meat is rotten." Quality filtering with semantic similarity thresholds (&gt; 0.8) is essential.' },
    { text: '400K question pairs labeled for semantic equivalence.', isTrue: true, explanation: 'Widely used for paraphrase identification training and evaluation.' },
    { text: 'If two sentences have high word overlap, they are paraphrases.', isTrue: false, explanation: 'The PAWS dataset was designed to expose exactly this fallacy. "Flights from New York to Paris" and "Flights from Paris to New York" have near-identical word overlap but opposite meanings.' },
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
