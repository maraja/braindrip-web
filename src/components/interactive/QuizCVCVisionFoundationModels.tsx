import { useState } from 'react';
export default function QuizCVCVisionFoundationModels() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'One foundation model will rule them all.', isTrue: false, explanation: 'Different pretraining objectives produce features with different strengths. CLIP excels at semantic tasks, DINOv2 at spatial tasks, and SAM at segmentation.' },
    { text: 'ViT is the universal backbone; CNNs have been largely displaced for foundation models due to ViT\'s scalability and compatibility with self-supervised objectives', isTrue: true, explanation: 'ViT is the universal backbone; CNNs have been largely displaced for foundation models due to ViT\'s scalability and compatibility with self-supervised objectives' },
    { text: 'Foundation models eliminate the need for task-specific data.', isTrue: false, explanation: 'While they dramatically reduce data requirements, competitive performance on specialized domains (medical imaging, remote sensing, industrial inspection) still benefits from domain-specific fine-tuning or adaptation.' },
    { text: '14x14 patches are standard; 16x16 is slightly faster but loses resolution; some models offer both (DINOv2 ViT-B/14 vs ViT-B/16)', isTrue: true, explanation: '14x14 patches are standard; 16x16 is slightly faster but loses resolution; some models offer both (DINOv2 ViT-B/14 vs ViT-B/16)' },
    { text: 'Bigger is always better.', isTrue: false, explanation: 'Distilled DINOv2 ViT-B (86M parameters) achieves ~96% of ViT-g\'s (1.1B) performance on most benchmarks at ~10x lower inference cost. The right model size depends on the deployment constraints.' },
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
