import { useState } from 'react';
export default function QuizCVCOpenVocabularyDetection() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Open-vocabulary detection can find anything.', isTrue: false, explanation: 'Performance degrades significantly for fine-grained distinctions (e.g., bird species), abstract concepts, and categories poorly represented in the pretraining text. It excels at common-noun object categories.' },
    { text: 'The standard evaluation uses LVIS (1,203 categories) split into frequent, common, and rare; OVD models are evaluated primarily on rare categories in zero-shot settings', isTrue: true, explanation: 'The standard evaluation uses LVIS (1,203 categories) split into frequent, common, and rare; OVD models are evaluated primarily on rare categories in zero-shot settings' },
    { text: 'You need detection annotations for all categories.', isTrue: false, explanation: 'The key insight is that you need detection annotations for proposal generation (class-agnostic) but not for classification. The text encoder generalizes classification to unseen categories.' },
    { text: 'Models trained on COCO base categories (48 classes) are evaluated on novel categories (17 classes); top models reach ~60 AP on novel categories', isTrue: true, explanation: 'Models trained on COCO base categories (48 classes) are evaluated on novel categories (17 classes); top models reach ~60 AP on novel categories' },
    { text: 'Open-vocabulary and zero-shot detection are the same thing.', isTrue: false, explanation: 'Zero-shot detection means no training examples for test categories. Open-vocabulary is broader -- it means the label set is defined by text at inference time, which may or may not include training categories.' },
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
