import { useState } from 'react';
export default function QuizNLPKnowledgeGraphsForNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Knowledge graphs are just databases.', isTrue: false, explanation: 'KGs differ from relational databases in their graph-native schema (triples, not tables), open-world assumption (absence of a fact does not mean it is false), and emphasis on entity identity and linking across sources. They are designed for flexible, evolving schema and cross-source integration.' },
    { text: 'Typically d = 100-500.', isTrue: true, explanation: 'Training on FB15k-237 takes 30-60 minutes on a single GPU.' },
    { text: 'KG embeddings understand the meaning of relations.', isTrue: false, explanation: 'Embedding models learn statistical patterns from the graph structure -- they do not understand that "born_in" implies a physical location or that "married_to" is symmetric. They capture co-occurrence patterns, not deep semantics.' },
    { text: 'MRR = 0.338, Hits@1 = 0.241, Hits@10 = 0.533.', isTrue: true, explanation: 'On WN18RR: MRR = 0.476, Hits@10 = 0.571.' },
    { text: 'Large language models make knowledge graphs obsolete.', isTrue: false, explanation: 'LLMs store knowledge implicitly in parameters, but this knowledge is unverifiable, hard to update, and prone to hallucination. KGs provide explicit, auditable, and dynamically updatable facts.' },
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
