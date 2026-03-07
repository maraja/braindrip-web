import { useState } from 'react';
export default function QuizCVCBenchmarkLeaderboards() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'ImageNet top-1 accuracy trajectory: 63.3% (AlexNet, 2012) -&gt; 74.9% (VGG, 2014) -&gt; 76.1% (ResNet, 2015) -&gt; 84.4% (EfficientNet-B7, 2019) -&gt; 88.5% (ViT-L, 2021) -&gt; 91.0% (CoCa, 2022).', isTrue: true, explanation: 'This is a key technical detail of Benchmark Leaderboards.' },
    { text: 'COCO AP trajectory: 37.4% (Faster R-CNN, 2015) -&gt; 43.4% (FPN, 2017) -&gt; 50.7% (DETR, 2020) -&gt; 57.5% (DINO-DETR, 2022) -&gt; 66.0% (Co-DETR, 2023).', isTrue: true, explanation: 'This is a key technical detail of Benchmark Leaderboards.' },
    { text: 'ADE20K mIoU: 29.4% (FCN, 2015) -&gt; 45.7% (DeepLabV3+, 2018) -&gt; 53.5% (Swin, 2021) -&gt; 62.9% (InternImage, 2023).', isTrue: true, explanation: 'This is a key technical detail of Benchmark Leaderboards.' },
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
