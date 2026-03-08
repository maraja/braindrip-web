import { useState } from 'react';
export default function QuizLLE06Llama32Multimodal() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The 11B and 90B vision models are natively multimodal like GPT-4o.', isTrue: false, explanation: 'They use an adapter architecture — a vision encoder plus cross-attention layers grafted onto the text model. GPT-4o (see 03-gpt-4o.md) was trained end-to-end across modalities, which enables different (and generally more fluid) cross-modal reasoning.' },
    { text: 'September 25, 2024 (LLaMA 3.2); December 2024 (LLaMA 3.3)', isTrue: true, explanation: 'September 25, 2024 (LLaMA 3.2); December 2024 (LLaMA 3.3)' },
    { text: 'The 1B model is too small to be useful.', isTrue: false, explanation: 'For basic tasks like text classification, simple Q&A, keyword extraction, and summarization of short texts, the 1B model is surprisingly capable. Its value lies not in matching larger models but in running instantly on resource-constrained hardware.' },
    { text: '11B (8B text + vision adapter) and 90B (70B text + vision adapter)', isTrue: true, explanation: '11B (8B text + vision adapter) and 90B (70B text + vision adapter)' },
    { text: 'LLaMA 3.3 70B made the 405B obsolete.', isTrue: false, explanation: 'The 405B still offered advantages on the most demanding tasks, particularly long-context reasoning and complex multi-step problems. The 70B matched it on common benchmarks, but benchmark averages can obscure capability differences at the tails.' },
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
