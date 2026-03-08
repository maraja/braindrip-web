import { useState } from 'react';
export default function QuizPEStructuredReasoningFormats() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'One reasoning format works for all tasks.', isTrue: false, explanation: 'Each format embodies assumptions about the task structure. OTA assumes iterative interaction, Given-Find-Solution assumes well-defined problems, CER assumes argumentative analysis.' },
    { text: 'Modern instruction-tuned models (GPT-4, Claude 3.5+) follow structured formats with 85-95% compliance when the format is clearly specified with headers and few-shot examples.', isTrue: true, explanation: 'Modern instruction-tuned models (GPT-4, Claude 3.5+) follow structured formats with 85-95% compliance when the format is clearly specified with headers and few-shot examples.' },
    { text: 'Structured formats restrict the model\'s reasoning ability.', isTrue: false, explanation: 'Good formats channel reasoning into productive paths without eliminating flexibility within each section. The model can still reason freely within the "Thought" section of OTA or the "Solution" section of Given-Find-Solution.' },
    { text: '2-3 examples demonstrating the target format typically achieve high compliance; 1 example may be insufficient for complex formats like OTA.', isTrue: true, explanation: '2-3 examples demonstrating the target format typically achieve high compliance; 1 example may be insufficient for complex formats like OTA.' },
    { text: 'The model will automatically follow any format you describe.', isTrue: false, explanation: 'Complex or ambiguous format specifications often produce partial compliance. Clear section headers, explicit field descriptions, and 2-3 examples are usually necessary for reliable format adherence.' },
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
