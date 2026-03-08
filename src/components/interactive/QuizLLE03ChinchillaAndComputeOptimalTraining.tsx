import { useState } from 'react';
export default function QuizLLE03ChinchillaAndComputeOptimalTraining() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Chinchilla proved bigger models are worse.', isTrue: false, explanation: 'Chinchilla proved that undertrained big models are worse than well-trained smaller ones. A 280B model trained on 5.6T tokens (Chinchilla-optimal) would outperform 70B Chinchilla — but no one had that much quality data or compute at the time.' },
    { text: 'March 2022, by Jordan Hoffmann et al.', isTrue: true, explanation: 'March 2022, by Jordan Hoffmann et al.' },
    { text: 'The 20:1 token-to-parameter ratio is a hard rule.', isTrue: false, explanation: 'It is an empirical finding for a specific compute-cost model. If inference costs dominate (as they do for widely deployed models), you may want to overtrain a smaller model, as LLaMA demonstrated.' },
    { text: 'Over 400 training runs, model sizes from 70M to 16B', isTrue: true, explanation: 'Over 400 training runs, model sizes from 70M to 16B' },
    { text: 'Chinchilla solved the scaling question.', isTrue: false, explanation: 'Subsequent work (Muennighoff et al., 2023) showed that data can be repeated with diminishing but positive returns, and that the optimal ratio depends on data quality. The Chinchilla ratio is a useful guideline, not a universal law.' },
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
