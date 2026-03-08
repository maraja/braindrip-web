import { useState } from 'react';
export default function QuizNLPBiasInNlp() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'Bias is just a data problem -- get better data and it goes away.', isTrue: false, explanation: 'While training data is the primary source, bias also enters through annotation schemes, model architectures, evaluation benchmarks, and deployment contexts. Even with perfectly balanced data, models can learn to exploit proxy variables (zip code as a proxy for race, writing style as a proxy for socioeconomic status).' },
    { text: 'Gender bias (male/female vs.', isTrue: true, explanation: 'career/family) d = 1.81 in GloVe; racial bias (European/African American names vs. pleasant/unpleasant) d = 1.41.' },
    { text: 'Debiasing embeddings solves NLP bias.', isTrue: false, explanation: 'Bolukbasi-style debiasing reduces performance on bias benchmarks like WEAT but does not eliminate bias from downstream tasks. Gonen and Goldberg (2019) showed that debiased embeddings still cluster stereotypical words together -- the bias is cosmetically removed from one test while persisting in the representation\'s deeper structure.' },
    { text: 'Google Translate achieved only ~50% accuracy on gender-neutral-to-English pronoun translation for stereotypically gendered occupations (tested on Turkish, Hungarian, Finnish) as of 2020.', isTrue: true, explanation: 'Google Translate achieved only ~50% accuracy on gender-neutral-to-English pronoun translation for stereotypically gendered occupations (tested on Turkish, Hungarian, Finnish) as of 2020.' },
    { text: 'Bias only affects marginalized groups.', isTrue: false, explanation: 'Bias also produces inaccurate representations of majority groups (e.g., reinforcing stereotypes about men being unemotional or aggressive). While the harm is disproportionate for marginalized groups, biased models are less accurate for everyone because they rely on stereotypical shortcuts rather than genuine linguistic understanding.' },
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
