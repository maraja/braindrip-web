import { useState } from 'react';
export default function QuizLLE05InstructionTuningAndFlan() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Instruction tuning and RLHF are the same thing.', isTrue: false, explanation: 'Instruction tuning uses supervised learning on instruction-response pairs. RLHF uses reinforcement learning to optimize for human preferences.' },
    { text: 'Wei et al., 137B model, 62 datasets, 12 task clusters', isTrue: true, explanation: 'Wei et al., 137B model, 62 datasets, 12 task clusters' },
    { text: 'Instruction tuning teaches the model new knowledge.', isTrue: false, explanation: 'Like RLHF, instruction tuning primarily reorganizes existing knowledge to be accessible through instructions. The model does not learn new facts — it learns a new interface for surfacing what it already knows.' },
    { text: 'Chung et al., PaLM 540B, 1,836 tasks, +9.4% avg improvement', isTrue: true, explanation: 'Chung et al., PaLM 540B, 1,836 tasks, +9.4% avg improvement' },
    { text: 'More instruction data is always better.', isTrue: false, explanation: 'Research consistently shows that data quality and diversity matter more than quantity. LIMA (Zhou et al., 2023) showed that just 1,000 carefully curated examples could produce strong instruction following, challenging the assumption that scale of instruction data is critical.' },
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
