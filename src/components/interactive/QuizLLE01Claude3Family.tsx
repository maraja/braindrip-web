import { useState } from 'react';
export default function QuizLLE01Claude3Family() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Opus was only marginally better than GPT-4.', isTrue: false, explanation: 'While individual benchmark differences were sometimes small, Opus outperformed GPT-4 across the breadth of evaluations — MMLU, GPQA, GSM8K, HumanEval, and qualitative reasoning. The consistency of the advantage was the point.' },
    { text: 'Haiku (fastest/cheapest), Sonnet (balanced), Opus (most capable)', isTrue: true, explanation: 'Haiku (fastest/cheapest), Sonnet (balanced), Opus (most capable)' },
    { text: 'The three tiers are just the same model at different sizes.', isTrue: false, explanation: 'Each tier was a distinct model with its own architecture and training. They shared design philosophy and safety approaches, but Haiku was not simply a compressed version of Opus.' },
    { text: '200,000 tokens across all tiers', isTrue: true, explanation: '200,000 tokens across all tiers' },
    { text: '200K context means the model uses all 200K tokens equally well.', isTrue: false, explanation: 'Like all long-context models, performance can degrade for information buried deep in the middle of very long contexts. The "needle in a haystack" performance was strong but not perfect across all positions.' },
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
