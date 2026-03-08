import { useState } from 'react';
export default function QuizNLPDomainAdaptation() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Domain adaptation requires pre-training from scratch.', isTrue: false, explanation: 'The whole point of domain adaptation is to avoid pre-training from scratch. Starting from a general pre-trained model and continuing on domain text is 10-100x cheaper than training a new model from scratch, and performs comparably or better because the general model provides a strong linguistic foundation.' },
    { text: '~23 days on 8 NVIDIA V100 GPUs for biomedical domain adaptation; used the same vocabulary as BERT.', isTrue: true, explanation: '~23 days on 8 NVIDIA V100 GPUs for biomedical domain adaptation; used the same vocabulary as BERT.' },
    { text: 'Any domain needs its own adapted model.', isTrue: false, explanation: 'Domain adaptation is most valuable when the target domain differs substantially from the general pre-training corpus. For domains well-represented in Common Crawl or Wikipedia (e.g., sports, technology news), general models already perform well, and the cost of domain adaptation may not be justified.' },
    { text: '~1 week on a single TPU v3-8; learned a new 31K-token vocabulary from scientific text.', isTrue: true, explanation: '~1 week on a single TPU v3-8; learned a new 31K-token vocabulary from scientific text.' },
    { text: 'More domain data always helps.', isTrue: false, explanation: 'Returns diminish rapidly after 500M-1B tokens of domain text. Beyond this point, the marginal improvement per additional token drops close to zero.' },
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
