import { useState } from 'react';
export default function QuizCVCImageCaptioning() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'CIDEr score directly measures caption quality.', isTrue: false, explanation: 'CIDEr measures n-gram overlap with reference captions. A model scoring 145 CIDEr may produce bland, generic captions that match references well but lack the richness humans expect.' },
    { text: 'Standard evaluation uses 5,000 test images with 5 human captions each; CIDEr is the primary metric (human performance ~85 CIDEr on Karpathy test split)', isTrue: true, explanation: 'Standard evaluation uses 5,000 test images with 5 human captions each; CIDEr is the primary metric (human performance ~85 CIDEr on Karpathy test split)' },
    { text: 'Captioning models understand the image.', isTrue: false, explanation: 'These models learn statistical correlations between visual patterns and language. They often fail on spatial relationships ("the cat is behind the dog"), counting ("three birds on a wire"), and uncommon compositions.' },
    { text: 'Show-Tell (2015): 94.3; BLIP (2022): 136.7; BLIP-2 (2023): 145.8; modern multimodal LLMs are less frequently evaluated on CIDEr due to their verbose style', isTrue: true, explanation: 'Show-Tell (2015): 94.3; BLIP (2022): 136.7; BLIP-2 (2023): 145.8; modern multimodal LLMs are less frequently evaluated on CIDEr due to their verbose style' },
    { text: 'Multimodal LLMs have solved captioning.', isTrue: false, explanation: 'While LLaVA and GPT-4V generate impressively fluent descriptions, they hallucinate objects, misidentify fine-grained categories, and struggle with precise spatial descriptions. The gap to human-level captioning remains significant for detailed, factually accurate descriptions.' },
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
