import { useState } from 'react';
export default function QuizLLE08Palm2AndGeminiEvolution() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Google was behind in AI because ChatGPT came from OpenAI.', isTrue: false, explanation: 'Google had massive internal AI capabilities and had been deploying language models in Search, Gmail, and other products for years. They were behind in the consumer chatbot race, not in fundamental research.' },
    { text: '540B dense, 780B tokens, 6,144 TPU v4 chips', isTrue: true, explanation: '540B dense, 780B tokens, 6,144 TPU v4 chips' },
    { text: 'PaLM 2 was a step backward because it was smaller than PaLM.', isTrue: false, explanation: 'Smaller parameter count with more training data produced a better model. This is the core Chinchilla insight — size without sufficient data is wasteful.' },
    { text: '~340B params (est.), 3.6T tokens, UL2 objectives, 100+ languages', isTrue: true, explanation: '~340B params (est.), 3.6T tokens, UL2 objectives, 100+ languages' },
    { text: 'Gemini 1.0 Ultra clearly beat GPT-4.', isTrue: false, explanation: 'Google\'s MMLU claim of 90.0% used chain-of-thought prompting (CoT@32), which is not directly comparable to GPT-4\'s 5-shot result. The benchmarking methodology was contested, and independent evaluations showed mixed results.' },
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
