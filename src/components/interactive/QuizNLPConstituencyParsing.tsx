import { useState } from 'react';
export default function QuizNLPConstituencyParsing() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'PCFGs capture all syntactic phenomena.', isTrue: false, explanation: 'PCFGs assume context-free independence -- the expansion of a node does not depend on its location in the tree. This misses lexical preferences, coordination constraints, and many other context-sensitive patterns.' },
    { text: 'Standard English benchmark; SOTA ~96.3% labeled bracketing F1.', isTrue: true, explanation: 'Standard English benchmark; SOTA ~96.3% labeled bracketing F1.' },
    { text: 'Constituency parsing is obsolete in the neural era.', isTrue: false, explanation: 'While some end-to-end systems bypass explicit parsing, constituency trees remain valuable for interpretability, linguistic analysis, and tasks where hierarchical structure matters (e.g., discourse parsing, code generation). Neural parsers have actually revived interest by making high-quality parsing fast and accurate.' },
    { text: '~73% F1; lexicalized PCFGs ~89%; neural chart parsers ~95.5--96.3%.', isTrue: true, explanation: '~73% F1; lexicalized PCFGs ~89%; neural chart parsers ~95.5--96.3%.' },
    { text: 'Higher F1 means better linguistic quality.', isTrue: false, explanation: 'Bracketing F1 measures structural overlap between predicted and gold trees, but it overweights long spans and may not penalize linguistically significant errors (e.g., PP-attachment) proportionally. Some linguistically important distinctions have minimal impact on F1.' },
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
