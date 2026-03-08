import { useState } from 'react';
export default function QuizCVC3dGaussianSplatting() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: '3DGS is just a faster NeRF.', isTrue: false, explanation: 'The representations are fundamentally different. NeRF stores the scene in MLP weights (implicit); 3DGS stores it as explicit point primitives.' },
    { text: 'A scene with 2M Gaussians requires ~500 MB of GPU memory (each Gaussian stores ~200 bytes: 3 position + 4 quaternion + 3 scale + 1 opacity + 48 SH = 59 floats).', isTrue: true, explanation: 'A scene with 2M Gaussians requires ~500 MB of GPU memory (each Gaussian stores ~200 bytes: 3 position + 4 quaternion + 3 scale + 1 opacity + 48 SH = 59 floats).' },
    { text: '3DGS achieves 27.2 dB average; Mip-NeRF 360 achieves 27.7 dB but renders 1000x slower.', isTrue: true, explanation: '3DGS achieves 27.2 dB average; Mip-NeRF 360 achieves 27.7 dB but renders 1000x slower.' },
    { text: '1080p at 100--200 FPS, 4K at 30--60 FPS on an RTX 3090.', isTrue: true, explanation: '1080p at 100--200 FPS, 4K at 30--60 FPS on an RTX 3090.' },
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
