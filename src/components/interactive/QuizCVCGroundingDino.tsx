import { useState } from 'react';
export default function QuizCVCGroundingDino() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Grounding DINO uses CLIP for text encoding.', isTrue: false, explanation: 'It uses BERT, not CLIP. The text features are trained from scratch within the detection framework rather than borrowing from a frozen vision-language model.' },
    { text: '52.5 AP (Swin-L backbone) without any COCO training data; with COCO fine-tuning: 63.0 AP', isTrue: true, explanation: '52.5 AP (Swin-L backbone) without any COCO training data; with COCO fine-tuning: 63.0 AP' },
    { text: 'It can only detect noun phrases.', isTrue: false, explanation: 'Grounding DINO can ground referring expressions that include attributes, relationships, and context ("the tallest building in the background"). However, performance degrades for highly complex or abstract descriptions.' },
    { text: 'Achieves strong results on rare categories, though exact numbers vary by evaluation protocol', isTrue: true, explanation: 'Achieves strong results on rare categories, though exact numbers vary by evaluation protocol' },
    { text: 'Zero-shot means it works perfectly on any category.', isTrue: false, explanation: 'Performance on fine-grained or domain-specific categories (e.g., "Honda Civic vs Toyota Corolla") is significantly weaker than on common objects. The model generalizes best for categories well-represented in its training data\'s text distribution.' },
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
