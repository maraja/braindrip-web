import { useState } from 'react';
export default function QuizLLE09MistralLargeAndEnterprise() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Mistral is just a small model company.', isTrue: false, explanation: 'The Mistral 7B and Mixtral origins created this perception, but by mid-2024 Mistral had a full-spectrum lineup from 7B to 123B, covering text, code, vision, and multiple architectures.' },
    { text: '123B dense, 128K context, 80+ programming languages, strong multilingual', isTrue: true, explanation: '123B dense, 128K context, 80+ programming languages, strong multilingual' },
    { text: 'European AI labs can\'t compete with American ones.', isTrue: false, explanation: 'Mistral Large 3\'s 675B MoE under Apache 2.0 directly challenges the largest open models from Meta and DeepSeek. The constraint was primarily compute scale, and Mistral\'s aggressive fundraising and H200 access have steadily closed even that gap.' },
    { text: '675B/41B MoE, 256K context, Apache 2.0, trained on 3,000 H200s, #2 open non-reasoning on LMArena', isTrue: true, explanation: '675B/41B MoE, 256K context, Apache 2.0, trained on 3,000 H200s, #2 open non-reasoning on LMArena' },
    { text: 'Open-weight means Mistral doesn\'t make money.', isTrue: false, explanation: 'Open-weight releases drive adoption; enterprise services drive revenue. The model is commercially viable, as demonstrated by Mistral\'s growing customer base and rising valuation.' },
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
