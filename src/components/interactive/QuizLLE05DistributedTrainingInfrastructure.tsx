import { useState } from 'react';
export default function QuizLLE05DistributedTrainingInfrastructure() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'You just need more GPUs to train a bigger model.', isTrue: false, explanation: 'Adding GPUs without proper parallelism strategy can actually slow training due to communication overhead. Efficient distributed training requires careful co-design of parallelism strategies, network topology, and batch scheduling.' },
    { text: 'Trained on ~1,000 V100 GPUs.', isTrue: true, explanation: 'Estimated $4.6M compute cost. 3D parallelism.' },
    { text: 'Data parallelism is enough for any model.', isTrue: false, explanation: 'Pure data parallelism requires the full model to fit on each GPU. For models above ~3B parameters on 80GB GPUs, some form of model parallelism (TP, PP, or ZeRO-3) is mandatory.' },
    { text: '540B params, 6,144 TPUv4 chips, Pathways system.', isTrue: true, explanation: '540B params, 6,144 TPUv4 chips, Pathways system.' },
    { text: 'Distributed training is just an engineering problem, not a research problem.', isTrue: false, explanation: 'DeepSeek\'s DualPipe, Google\'s Pathways, and DeepSpeed\'s ZeRO represent genuine research innovations that required novel algorithms and mathematical analysis, not just implementation effort.' },
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
