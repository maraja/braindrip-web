import { useState } from 'react';
export default function QuizCVCVisionTransformer() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Pre-trained on JFT-300M (Google internal), ViT-H/14 achieved 88.55% top-1 on ImageNet, exceeding the prior CNN SOTA.', isTrue: true, explanation: 'This is a key technical detail of Vision Transformer (ViT).' },
    { text: 'When trained only on ImageNet-1K (1.28M images), ViT-B/16 underperforms a comparable ResNet -- large-scale pre-training is critical.', isTrue: true, explanation: 'This is a key technical detail of Vision Transformer (ViT).' },
    { text: 'Fine-tuning at higher resolution (e.g., 384 or 512) is common; positional embeddings are bilinearly interpolated to handle the longer sequence.', isTrue: true, explanation: 'This is a key technical detail of Vision Transformer (ViT).' },
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
