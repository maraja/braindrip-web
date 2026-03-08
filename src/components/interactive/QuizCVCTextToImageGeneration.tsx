import { useState } from 'react';
export default function QuizCVCTextToImageGeneration() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Text-to-image models understand language.', isTrue: false, explanation: 'They learn correlations between text patterns and visual patterns. Models still struggle with negation ("a room without chairs"), precise counting ("exactly five apples"), and complex spatial relationships ("A is to the left of B, which is behind C").' },
    { text: 'Stable Diffusion\'s VAE compresses 512x512x3 images to 64x64x4 latents; SDXL uses 128x128x4 for 1024px images', isTrue: true, explanation: 'Stable Diffusion\'s VAE compresses 512x512x3 images to 64x64x4 latents; SDXL uses 128x128x4 for 1024px images' },
    { text: 'Higher resolution means better quality.', isTrue: false, explanation: 'Upscaling adds detail but cannot fix compositional errors. A 1024px image with wrong spatial relationships is not better than a correct 512px image.' },
    { text: '~4 seconds for 50-step DDPM on an A100 (Stable Diffusion 1.5); ~2 seconds with DDIM 20-step; ~8 seconds for SDXL', isTrue: true, explanation: '~4 seconds for 50-step DDPM on an A100 (Stable Diffusion 1.5); ~2 seconds with DDIM 20-step; ~8 seconds for SDXL' },
    { text: 'These models copy training images.', isTrue: false, explanation: 'Studies show that direct memorization of training images occurs but is rare (&lt;1% of generations for Stable Diffusion). Most outputs are novel compositions that recombine learned visual concepts.' },
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
