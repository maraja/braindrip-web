import { useState } from 'react';
export default function QuizLLE08TheScalingHypothesisDebate() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'The scaling hypothesis says bigger is always better.', isTrue: false, explanation: 'Even scaling advocates acknowledge that data quality, training methodology, and post-training matter. The hypothesis is about the centrality of scale, not its exclusivity.' },
    { text: 'Power-law improvement spanning 7+ orders of magnitude', isTrue: true, explanation: 'Power-law improvement spanning 7+ orders of magnitude' },
    { text: 'The scaling hypothesis has been proven false.', isTrue: false, explanation: 'Neither proven nor disproven. Models keep getting better with scale, but it is unclear whether this trend will continue to AGI or plateau.' },
    { text: '117M (GPT-1) -&gt; 1.5B (GPT-2) -&gt; 175B (GPT-3), each with qualitative capability jumps', isTrue: true, explanation: '117M (GPT-1) -&gt; 1.5B (GPT-2) -&gt; 175B (GPT-3), each with qualitative capability jumps' },
    { text: 'If scaling works, we don\'t need any other research.', isTrue: false, explanation: 'Even strong scaling advocates at OpenAI and Google invest heavily in RLHF, data curation, architecture optimization, and safety research. Scale is a necessary condition, not a sufficient one, in virtually everyone\'s view.' },
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
