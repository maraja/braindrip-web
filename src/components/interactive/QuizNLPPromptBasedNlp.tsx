import { useState } from 'react';
export default function QuizNLPPromptBasedNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Prompt engineering is just trial and error.', isTrue: false, explanation: 'While manual prompt design involves experimentation, there are systematic principles: prompts should match the pre-training distribution, verbalizers should use high-frequency words the model associates with the target concepts, and templates should be grammatically natural. Automated methods (P-tuning, prompt tuning) further systematize the process.' },
    { text: 'BERT-base + PET with 32 labeled examples on Yelp Full: 53.6% accuracy, vs.', isTrue: true, explanation: 'standard fine-tuning with 32 examples: 40.4%, vs. fine-tuning with full dataset: 66.1%.' },
    { text: 'Prompt-based methods always beat fine-tuning.', isTrue: false, explanation: 'In high-data regimes (10K+ labeled examples), standard fine-tuning typically matches or exceeds prompt-based methods. The advantage of prompts is concentrated in low-data settings (fewer than 500 examples).' },
    { text: 'With T5-11B, prompt tuning matches full fine-tuning on SuperGLUE; with T5-Base (220M), prompt tuning lags by ~5 points, highlighting the importance of model scale.', isTrue: true, explanation: 'With T5-11B, prompt tuning matches full fine-tuning on SuperGLUE; with T5-Base (220M), prompt tuning lags by ~5 points, highlighting the importance of model scale.' },
    { text: 'Soft prompts are interpretable.', isTrue: false, explanation: 'Learned continuous prompt vectors do not correspond to real words. Attempts to decode them into text often produce incoherent sequences.' },
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
