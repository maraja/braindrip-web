import { useState } from 'react';
export default function QuizNLPTransferLearningInNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Transfer learning means freezing all pre-trained weights.', isTrue: false, explanation: 'Freezing is one option (feature-based transfer), but the dominant paradigm is fine-tuning, where all or most pre-trained weights are updated. The choice depends on dataset size and computational budget -- freezing works better with very small datasets, full fine-tuning with moderate-to-large ones.' },
    { text: 'BERT used 3.3B tokens (BooksCorpus + English Wikipedia); GPT-3 used ~300B tokens; modern models use 1-15T tokens.', isTrue: true, explanation: 'BERT used 3.3B tokens (BooksCorpus + English Wikipedia); GPT-3 used ~300B tokens; modern models use 1-15T tokens.' },
    { text: 'Pre-training only captures word meanings.', isTrue: false, explanation: 'Pre-trained language models learn far more than lexical semantics. Probing studies (Tenney et al., 2019) show that BERT\'s layers encode POS tags, constituency structure, dependency relations, semantic roles, and coreference -- a full stack of linguistic knowledge.' },
    { text: 'BERT fine-tuning typically needs 1K-10K labeled examples for strong performance; ULMFiT demonstrated competitive results with as few as 100 examples on IMDb.', isTrue: true, explanation: 'BERT fine-tuning typically needs 1K-10K labeled examples for strong performance; ULMFiT demonstrated competitive results with as few as 100 examples on IMDb.' },
    { text: 'Transfer learning eliminates the need for labeled data.', isTrue: false, explanation: 'Transfer learning dramatically reduces the amount of labeled data needed, but most fine-tuning approaches still require at least some task-specific labels. Zero-shot and few-shot prompting (see prompt-based-nlp.md and gpt-for-nlp-tasks.md) push this further but do not fully eliminate the need for task specification.' },
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
