import { useState } from 'react';
export default function QuizPEZeroShotChainOfThought() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Zero-shot-CoT is always worse than few-shot-CoT.', isTrue: false, explanation: 'With modern frontier models and well-phrased instructions, zero-shot-CoT frequently closes the gap to within 1-3% of few-shot-CoT, especially on tasks where the model has strong pretraining coverage.' },
    { text: 'MultiArith accuracy went from 17.7% to 78.7% with zero-shot-CoT using InstructGPT (text-davinci-002).', isTrue: true, explanation: 'MultiArith accuracy went from 17.7% to 78.7% with zero-shot-CoT using InstructGPT (text-davinci-002).' },
    { text: 'Any instruction to \'think\' triggers CoT.', isTrue: false, explanation: 'Vague phrases like "think carefully" or "be thorough" do not reliably activate step-by-step reasoning generation. The trigger phrase must signal decomposition and sequential processing to be effective.' },
    { text: '"Let\'s think step by step" consistently outperformed alternatives across 12 benchmarks in the original study.', isTrue: true, explanation: '"Let\'s think step by step" consistently outperformed alternatives across 12 benchmarks in the original study.' },
    { text: 'Zero-shot-CoT eliminates the need for prompt engineering.', isTrue: false, explanation: 'It eliminates the need for example engineering, but the surrounding prompt still matters. Role assignment, output format specification, and constraint setting all interact with and modulate the effectiveness of zero-shot-CoT.' },
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
