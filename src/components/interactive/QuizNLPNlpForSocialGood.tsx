import { useState } from 'react';
export default function QuizNLPNlpForSocialGood() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'NLP for social good is just regular NLP applied to new domains.', isTrue: false, explanation: 'The technical challenges are often secondary to the ethical, logistical, and community engagement challenges. Building a clinical NLP system requires navigating HIPAA compliance, obtaining IRB approval, partnering with clinicians, and validating in real clinical workflows -- not just training a model.' },
    { text: 'Medication extraction achieves 93--95% F1; disease/condition extraction 86--91% F1; adverse event detection 84--88% F1 on i2b2/n2c2 benchmarks.', isTrue: true, explanation: 'Medication extraction achieves 93--95% F1; disease/condition extraction 86--91% F1; adverse event detection 84--88% F1 on i2b2/n2c2 benchmarks.' },
    { text: 'More technology automatically means more social benefit.', isTrue: false, explanation: 'Deploying NLP in sensitive contexts without community input, cultural understanding, and appropriate safeguards can cause harm. Automated mental health monitoring without clinical oversight can lead to false alarms, stigmatization, or inappropriate interventions.' },
    { text: 'Top AES systems achieve QWK of 0.78--0.85 with human raters, compared to human-human QWK of 0.80--0.90.', isTrue: true, explanation: 'Top AES systems achieve QWK of 0.78--0.85 with human raters, compared to human-human QWK of 0.80--0.90.' },
    { text: 'Social good applications require state-of-the-art models.', isTrue: false, explanation: 'Many impactful applications use relatively simple NLP -- rule-based de-identification, keyword-based crisis monitoring, n-gram readability scoring. The bottleneck is often data access, domain expertise, and deployment infrastructure, not model sophistication.' },
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
