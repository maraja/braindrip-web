import { useState } from 'react';
export default function QuizNLPOpenInformationExtraction() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Open IE extractions are as precise as schema-based IE.', isTrue: false, explanation: 'Open IE trades precision for generality. Relation phrases are surface-level strings, not canonical relations -- "was born in," "is from," and "hails from" are three separate relations in Open IE but map to the same born_in relation in schema-based IE.' },
    { text: '15+ million triples from 500 million web pages with &gt;80% precision at the highest confidence tier.', isTrue: true, explanation: '15+ million triples from 500 million web pages with &gt;80% precision at the highest confidence tier.' },
    { text: 'Open IE works equally well on all text.', isTrue: false, explanation: 'Performance degrades significantly on informal text (tweets, chat), highly technical text (legal documents), and languages other than English. Most Open IE research focuses on well-edited English text.' },
    { text: '1.9x higher recall than ReVerb at comparable precision, primarily from capturing noun-mediated and adjective-mediated relations.', isTrue: true, explanation: '1.9x higher recall than ReVerb at comparable precision, primarily from capturing noun-mediated and adjective-mediated relations.' },
    { text: 'Open IE replaces traditional relation extraction.', isTrue: false, explanation: 'Open IE and schema-based relation extraction (see 05-core-nlp-tasks-analysis/relation-extraction.md) serve different use cases. When you know exactly which relations matter (e.g., extracting drug interactions from medical literature), schema-based RE with a trained model will outperform Open IE in precision and recall for those specific relations.' },
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
