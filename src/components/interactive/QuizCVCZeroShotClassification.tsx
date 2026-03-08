import { useState } from 'react';
export default function QuizCVCZeroShotClassification() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Zero-shot means no training at all.', isTrue: false, explanation: 'The model is extensively pretrained on hundreds of millions of image-text pairs. "Zero-shot" refers specifically to the target classification task -- no examples from those categories were used during pretraining in a labeled sense.' },
    { text: 'CLIP ViT-L/14@336px: 76.2%; OpenCLIP ViT-G/14: 80.1%; SigLIP ViT-SO400M: 83.1%; EVA-CLIP ViT-18B: 83.8%', isTrue: true, explanation: 'CLIP ViT-L/14@336px: 76.2%; OpenCLIP ViT-G/14: 80.1%; SigLIP ViT-SO400M: 83.1%; EVA-CLIP ViT-18B: 83.8%' },
    { text: 'Zero-shot classification works equally well for all domains.', isTrue: false, explanation: 'Performance varies enormously by domain. CLIP\'s accuracy can range from 95%+ on simple benchmarks (CIFAR-10) to below 50% on specialized domains (fine-grained medical, satellite imagery).' },
    { text: 'Zero-shot accuracy drops sharply on specialized domains -- CLIP achieves 76.2% on ImageNet but only 58.8% on EuroSAT (satellite) and 43.3% on DTD (textures)', isTrue: true, explanation: 'Zero-shot accuracy drops sharply on specialized domains -- CLIP achieves 76.2% on ImageNet but only 58.8% on EuroSAT (satellite) and 43.3% on DTD (textures)' },
    { text: 'Text embeddings are a drop-in replacement for trained classifiers.', isTrue: false, explanation: 'On in-distribution data, a linear probe trained on even 16 labeled examples per class typically outperforms zero-shot classification by 5-15 percentage points. Zero-shot is powerful when labeled data is unavailable, not when it is plentiful.' },
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
