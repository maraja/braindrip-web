import { useState } from 'react';
export default function QuizNLPPrivacyInNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Only models trained on private data have privacy issues.', isTrue: false, explanation: 'Models trained on "public" web data still memorize personal information -- email addresses, phone numbers, and home addresses posted online without the individual\'s awareness or consent. Carlini et al.\'s GPT-2 extraction targeted a model trained on publicly scraped web text, not private data.' },
    { text: 'Doubling model parameters increases extractable memorized content by ~1.5x (Carlini et al., 2023).', isTrue: true, explanation: 'Doubling model parameters increases extractable memorized content by ~1.5x (Carlini et al., 2023).' },
    { text: 'Differential privacy makes models useless.', isTrue: false, explanation: 'While the privacy-utility trade-off is real, recent advances in private fine-tuning (pre-train publicly, fine-tune privately) achieve reasonable utility at practical privacy budgets (epsilon = 3--8). For classification tasks, the accuracy gap is often 2--5%, not the 15--30% seen in full private training.' },
    { text: 'DP training is 2--10x slower than non-private training due to per-example gradient clipping and noise addition.', isTrue: true, explanation: 'Memory overhead is ~2x because per-example gradients cannot be batched as efficiently.' },
    { text: 'De-identification completely protects privacy.', isTrue: false, explanation: 'Even perfect de-identification of direct identifiers leaves re-identification risk from quasi-identifier combinations. Narrative text in clinical notes often contains implicit identifying information ("the mayor of Springfield who underwent surgery in March") that rule-based systems miss.' },
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
