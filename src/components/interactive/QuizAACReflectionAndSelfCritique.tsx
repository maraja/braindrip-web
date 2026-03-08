import { useState } from 'react';
export default function QuizAACReflectionAndSelfCritique() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Reflection is the same as chain-of-thought.', isTrue: false, explanation: 'CoT happens before or during action, guiding the current step. Reflection happens after action, evaluating what already occurred.' },
    { text: '91% pass@1 on HumanEval (vs 80% baseline), 77% on HotpotQA (vs 57% baseline), 75% on AlfWorld (vs 22% baseline) over 3-5 attempts', isTrue: true, explanation: '91% pass@1 on HumanEval (vs 80% baseline), 77% on HotpotQA (vs 57% baseline), 75% on AlfWorld (vs 22% baseline) over 3-5 attempts' },
    { text: 'More reflection is always better.', isTrue: false, explanation: 'Excessive reflection wastes tokens and can lead to overthinking, where the agent becomes so cautious from prior reflections that it fails to act decisively. 2-3 specific reflections are more useful than 10 vague ones.' },
    { text: 'Performance typically plateaus after 3-5 attempts; beyond that, reflections become repetitive or contradictory', isTrue: true, explanation: 'Performance typically plateaus after 3-5 attempts; beyond that, reflections become repetitive or contradictory' },
    { text: 'Reflection requires ground-truth feedback.', isTrue: false, explanation: 'While exact-match evaluators are ideal, reflection also works with LLM-based evaluation, heuristic scoring, or even self-evaluation. The quality degrades with noisier evaluators, but the pattern still provides value.' },
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
