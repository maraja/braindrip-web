import { useState } from 'react';
export default function QuizLLE02TheAlpacaEffect() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Alpaca was as good as ChatGPT.', isTrue: false, explanation: 'Alpaca mimicked ChatGPT\'s style on simple tasks but lacked its reasoning depth, factual accuracy, and robustness. Qualitative demos were impressive; rigorous benchmarks showed large gaps.' },
    { text: 'LLaMA-7B fine-tuned on 52K synthetic instructions from GPT-3.5, ~$600 total cost', isTrue: true, explanation: 'LLaMA-7B fine-tuned on 52K synthetic instructions from GPT-3.5, ~$600 total cost' },
    { text: 'Distillation transfers all capabilities.', isTrue: false, explanation: 'Distilling from a larger model\'s outputs captures surface-level patterns but cannot transfer the knowledge embedded in the teacher\'s 175B+ parameters. The student model learns to imitate outputs, not to replicate the underlying competence.' },
    { text: '175 seed tasks expanded by text-davinci-003, 3 epochs of supervised fine-tuning', isTrue: true, explanation: '175 seed tasks expanded by text-davinci-003, 3 epochs of supervised fine-tuning' },
    { text: 'Open fine-tuned models eliminated the need for commercial APIs.', isTrue: false, explanation: 'For production applications requiring reliability, factual accuracy, and consistent quality, commercial models remained significantly ahead. The open models were transformative for experimentation, education, and niche applications, but not yet for enterprise deployment.' },
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
