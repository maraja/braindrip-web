import { useState } from 'react';
export default function QuizLLE08Gemini1() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Gemini clearly beat GPT-4.', isTrue: false, explanation: 'The MMLU result (90.04% vs. GPT-4\'s 86.4%) was achieved using a specific evaluation protocol (CoT@32, choosing the best of 32 chain-of-thought samples).' },
    { text: 'Ultra (largest), Pro (balanced), Nano (on-device: 1.8B and 3.25B parameters)', isTrue: true, explanation: 'Ultra (largest), Pro (balanced), Nano (on-device: 1.8B and 3.25B parameters)' },
    { text: 'Gemini was a single model.', isTrue: false, explanation: 'Gemini was a family of three distinct models (Ultra, Pro, Nano) with very different sizes and capabilities. Comparing "Gemini" to "GPT-4" without specifying the tier was misleading — most users interacted with Gemini Pro, not Ultra.' },
    { text: 'Transformer-based, reportedly MoE; trained natively on multimodal data', isTrue: true, explanation: 'Transformer-based, reportedly MoE; trained natively on multimodal data' },
    { text: 'The demo video showed real capabilities.', isTrue: false, explanation: 'The Gemini launch video depicted idealized interactions that did not reflect the actual user experience. The model could process images and video, but not with the speed and fluidity the demo implied.' },
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
