import { useState } from 'react';
export default function QuizRLDeepQNetworks() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'DQN learns to play games like humans do.', isTrue: false, explanation: 'DQN exploits pixel-level patterns and has no concept of game semantics. It may find strategies humans would never use -- and fail at tasks trivial for humans (like navigating a maze in Montezuma\'s Revenge).' },
    { text: '50 million frames per game (~38 days of game time at 60 FPS), approximately 10 days on a single GPU (circa 2015).', isTrue: true, explanation: '50 million frames per game (~38 days of game time at 60 FPS), approximately 10 days on a single GPU (circa 2015).' },
    { text: 'The convolutional architecture is what made DQN work.', isTrue: false, explanation: 'The CNN architecture is important for processing pixels, but the algorithmic innovations -- experience replay and target networks -- are what made training stable. Without them, even perfect architectures diverge.' },
    { text: 'All rewards clipped to [-1, +1] to standardize across games.', isTrue: true, explanation: 'All rewards clipped to [-1, +1] to standardize across games.' },
    { text: 'DQN is sample efficient.', isTrue: false, explanation: 'DQN requires roughly 200 million frames (about 925 hours of gameplay) across training. Humans typically achieve comparable performance in minutes.' },
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
