import { useState } from 'react';
export default function QuizNLPNamedEntityRecognition() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'NER is just dictionary lookup.', isTrue: false, explanation: 'Gazetteer-based lookup catches known entities but misses novel ones ("Elon Musk\'s new company Neuralink" before it was widely known), ambiguous mentions ("Apple" as company vs. fruit), and morphological variants.' },
    { text: '4 entity types (PER, LOC, ORG, MISC); SOTA ~94 F1 (ensemble models with document context).', isTrue: true, explanation: '4 entity types (PER, LOC, ORG, MISC); SOTA ~94 F1 (ensemble models with document context).' },
    { text: 'NER and entity linking are the same task.', isTrue: false, explanation: 'NER identifies entity mentions and their types; entity linking (or entity disambiguation) maps those mentions to specific entries in a knowledge base (e.g., mapping "Obama" to the Wikidata entity Q76). They are related but distinct pipeline stages.' },
    { text: '18 entity types; SOTA ~92 F1; more diverse and challenging than CoNLL-2003.', isTrue: true, explanation: '18 entity types; SOTA ~92 F1; more diverse and challenging than CoNLL-2003.' },
    { text: 'Flat NER is sufficient for all applications.', isTrue: false, explanation: 'Many real-world texts contain nested entities ("University of California, Berkeley" contains LOC "California" inside ORG). Flat IOB tagging cannot represent overlaps, motivating span-based and layered approaches.' },
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
