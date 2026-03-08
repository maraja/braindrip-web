import { useState } from 'react';
export default function QuizLLE05TheConvergenceTowardOmniModels() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Omni-models are just many specialist models packaged together.', isTrue: false, explanation: 'True omni-models process all modalities through shared parameters and develop genuinely cross-modal representations. This is architecturally different from running separate models behind a unified API, which still suffers from information loss at model boundaries.' },
    { text: 'GPT-3 (text), ViT (images), Wav2Vec 2.0 (audio) — separate models, separate pipelines.', isTrue: true, explanation: 'GPT-3 (text), ViT (images), Wav2Vec 2.0 (audio) — separate models, separate pipelines.' },
    { text: 'Separate specialist models will always outperform generalist omni-models.', isTrue: false, explanation: 'While specialists initially outperform generalists on their specific modality, omni-models at sufficient scale match or exceed specialists because cross-modal training provides additional learning signal. Visual training improves text understanding; code training improves reasoning.' },
    { text: 'Shared vision-text embedding.', isTrue: true, explanation: '400M image-text pairs. Zero-shot classification.' },
    { text: 'The convergence means we only need one model for everything.', isTrue: false, explanation: 'Omni-models handle most common tasks well, but specialized fine-tuned models still outperform them on specific domains like medical imaging, music transcription, or protein structure prediction. The convergence is about the base model, not the elimination of all specialization.' },
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
