import { useState } from 'react';
export default function QuizPEMetaPrompting() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Meta-prompting means the model writes a perfect prompt on the first try.', isTrue: false, explanation: 'The initial generated prompt is rarely optimal. Meta-prompting\'s value comes from iterative refinement, where each round improves upon the last based on evaluation feedback.' },
    { text: 'Meta-prompting adds the cost of the meta-layer call(s).', isTrue: true, explanation: 'For a single meta-prompt generation, this is 1x additional cost. For iterative optimization with 5-10 rounds, the total cost during optimization can be 10-50x a single call, though the optimized prompt is then reused across many executions.' },
    { text: 'Meta-prompting eliminates the need for prompt engineering expertise.', isTrue: false, explanation: 'It reduces the need for manual prompt crafting but introduces new challenges: designing the meta-prompt itself, building evaluation functions, setting up optimization infrastructure, and reviewing generated prompts for safety. The expertise shifts rather than disappears.' },
    { text: 'Iterative prompt optimization typically converges within 5-15 rounds on well-defined tasks, with the majority of improvement in the first 3-5 rounds.', isTrue: true, explanation: 'Iterative prompt optimization typically converges within 5-15 rounds on well-defined tasks, with the majority of improvement in the first 3-5 rounds.' },
    { text: 'Any model can do meta-prompting.', isTrue: false, explanation: 'The meta-layer requires strong instruction following, reasoning about task requirements, and knowledge of effective prompt patterns. Weaker models generate lower-quality prompts.' },
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
