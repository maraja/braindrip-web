import { useState } from 'react';
export default function QuizCVCDinov2() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Self-supervised learning always produces weaker features than supervised.', isTrue: false, explanation: 'DINOv2 conclusively disproved this at sufficient scale. The key ingredients are data curation, training scale, and combining complementary self-supervised objectives.' },
    { text: 'ViT-g/14: 86.3% top-1; ViT-L/14: 84.5%; ViT-B/14: 82.1%; ViT-S/14: 79.0%', isTrue: true, explanation: 'ViT-g/14: 86.3% top-1; ViT-L/14: 84.5%; ViT-B/14: 82.1%; ViT-S/14: 79.0%' },
    { text: 'DINOv2 is just a bigger DINO.', isTrue: false, explanation: 'While it inherits the self-distillation framework, DINOv2 adds masked image modeling (iBOT), a curated 142M-image dataset, and systematic distillation -- these are substantive methodological advances, not just scaling.' },
    { text: 'ViT-g trained for ~22,000 A100 GPU-hours (roughly 500 A100-days)', isTrue: true, explanation: 'ViT-g trained for ~22,000 A100 GPU-hours (roughly 500 A100-days)' },
    { text: 'CLIP is always better because it uses language.', isTrue: false, explanation: 'DINOv2 matches CLIP on many benchmarks and significantly outperforms it on dense prediction tasks (segmentation, depth) because its patch-level features are more spatially precise. CLIP is better for tasks requiring text-image alignment; DINOv2 is better for pure visual understanding.' },
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
