import { useState } from 'react';
export default function QuizNLPInformationExtraction() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'IE and NER are the same thing.', isTrue: false, explanation: 'NER is one component of the IE pipeline. IE encompasses relation extraction, event extraction, template filling, and temporal reasoning -- all building on entity recognition as a foundation.' },
    { text: 'Entity detection F1 ~90%, relation extraction F1 ~75%, event trigger classification F1 ~78%, event argument extraction F1 ~58-65%.', isTrue: true, explanation: 'Entity detection F1 ~90%, relation extraction F1 ~75%, event trigger classification F1 ~78%, event argument extraction F1 ~58-65%.' },
    { text: 'IE requires large annotated datasets for every new domain.', isTrue: false, explanation: 'While supervised IE benefits from labeled data, transfer learning from pre-trained models, distant supervision, and few-shot prompting have dramatically reduced the annotation burden. Modern systems can bootstrap IE in new domains with tens of examples rather than thousands.' },
    { text: 'Best systems reach ~42% F1 end-to-end -- the bottleneck is recall across large corpora.', isTrue: true, explanation: 'Best systems reach ~42% F1 end-to-end -- the bottleneck is recall across large corpora.' },
    { text: 'End-to-end neural models always outperform rule-based IE.', isTrue: false, explanation: 'In narrow, well-defined domains (e.g., extracting dates and amounts from financial filings), hand-crafted rules can achieve near-perfect precision. The advantage of neural models emerges in broad, open-domain settings with diverse linguistic expressions.' },
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
