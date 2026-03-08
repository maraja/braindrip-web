import { useState } from 'react';
export default function QuizNLPPartOfSpeechTagging() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'POS tagging is a solved problem.', isTrue: false, explanation: 'At ~98% accuracy on clean news text, it may seem solved, but accuracy drops to ~90--93% on social media, historical text, and code-switched multilingual data. The long tail of errors (ambiguous words in unusual contexts) still matters for downstream tasks.' },
    { text: '36 tags; SOTA ~97.9% accuracy; ~1 million annotated tokens from Wall Street Journal text.', isTrue: true, explanation: '36 tags; SOTA ~97.9% accuracy; ~1 million annotated tokens from Wall Street Journal text.' },
    { text: 'Each word has one POS tag.', isTrue: false, explanation: 'Many words are systematically ambiguous: "run" can be NN or VB; "that" can be DT, IN, WDT, or RB depending on context. Roughly 40% of English word types are ambiguous across POS categories, though the most frequent tag is correct ~90% of the time (baseline heuristic).' },
    { text: '17 tags across 100+ languages; accuracy varies from ~98% (English, German) to ~85% (low-resource languages).', isTrue: true, explanation: '17 tags across 100+ languages; accuracy varies from ~98% (English, German) to ~85% (low-resource languages).' },
    { text: 'POS tagging is irrelevant in the era of BERT.', isTrue: false, explanation: 'While end-to-end models can sometimes bypass explicit POS features, POS tags remain useful for interpretability, rule-based post-processing, linguistic analysis, and as auxiliary training signals. Many production NLP pipelines still include an explicit POS tagging step.' },
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
