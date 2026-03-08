import { useState } from 'react';
export default function QuizLLE04VideoUnderstanding() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Video understanding is just image understanding applied to multiple frames.', isTrue: false, explanation: 'Temporal reasoning — understanding sequence, causality, duration, and change over time — is a fundamentally different capability from spatial visual understanding. Models that excel at image QA can fail at basic temporal video questions because they lack the ability to reason about how things change.' },
    { text: 'At 256 tokens/frame: 1 min = 15,360 tokens; 10 min = 153,600; 1 hour = 921,600.', isTrue: true, explanation: 'At 256 tokens/frame: 1 min = 15,360 tokens; 10 min = 153,600; 1 hour = 921,600.' },
    { text: 'Models truly \'watch\' videos like humans do.', isTrue: false, explanation: 'Current models process sampled frames, not continuous video. At 1 fps, they see one frame per second and miss everything between frames.' },
    { text: 'Uniform sampling at 1-2 fps for short videos, 0.25-0.5 fps for hour-long videos.', isTrue: true, explanation: 'Uniform sampling at 1-2 fps for short videos, 0.25-0.5 fps for hour-long videos.' },
    { text: 'Long-context models solve video understanding.', isTrue: false, explanation: 'Long context enables processing more frames, but the core challenge of temporal reasoning is not solved by context length alone. Models still struggle with precise temporal ordering and fine-grained causal reasoning even with million-token contexts.' },
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
