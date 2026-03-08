import { useState } from 'react';
export default function QuizNLPResponsibleNlpDevelopment() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Responsible development slows down research.', isTrue: false, explanation: 'Documentation, bias evaluation, and ethics review add overhead, but they also catch errors, improve reproducibility, and prevent costly post-deployment failures. The cost of a bias scandal or regulatory fine far exceeds the cost of a pre-deployment audit.' },
    { text: 'Hugging Face hosts 500,000+ model cards as of 2024; Google, Meta, and OpenAI publish model cards for major releases.', isTrue: true, explanation: 'Hugging Face hosts 500,000+ model cards as of 2024; Google, Meta, and OpenAI publish model cards for major releases.' },
    { text: 'Model cards and datasheets are just bureaucratic checkboxes.', isTrue: false, explanation: 'When done well, model cards and datasheets force developers to think critically about their system\'s limitations and affected populations. The value is in the thinking process, not just the document.' },
    { text: 'GPT-3 training ~552 tonnes CO2e; BLOOM (BigScience, 176B) reported 25 tonnes CO2e due to nuclear-powered compute -- demonstrating that energy source matters as much as compute volume.', isTrue: true, explanation: 'GPT-3 training ~552 tonnes CO2e; BLOOM (BigScience, 176B) reported 25 tonnes CO2e due to nuclear-powered compute -- demonstrating that energy source matters as much as compute volume.' },
    { text: 'Environmental concerns are secondary to model performance.', isTrue: false, explanation: 'The NLP community\'s energy consumption is a legitimate ethical concern. Strubell et al.' },
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
