import { useState } from 'react';
export default function QuizRLAtariAndArcadeGames() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const questions = [
    { text: 'DQN solved Atari.', isTrue: false, explanation: 'DQN failed catastrophically on games requiring exploration (Montezuma\'s Revenge), long-term planning (Skiing), or complex 3D reasoning (Pitfall). Subsequent algorithms like Rainbow DQN (rainbow-dqn.md), Go-Explore, and Agent57 were needed to approach human-level performance across all 57 Atari games.' },
    { text: 'DQN achieved superhuman performance on 29 of 49 tested Atari games, measured against professional human game testers.', isTrue: true, explanation: 'DQN achieved superhuman performance on 29 of 49 tested Atari games, measured against professional human game testers.' },
    { text: 'DQN was the first use of neural networks in RL.', isTrue: false, explanation: 'Tesauro\'s TD-Gammon (1992) used a neural network with TD learning to play backgammon at world-class level. What was new was the combination of deep convolutional networks, experience replay, and target networks to achieve stability across many diverse tasks from raw pixels.' },
    { text: 'Breakout (score: 401 vs.', isTrue: true, explanation: 'human 31), Pong (21 vs. human 9.3), Video Pinball (42,684 vs.' },
    { text: 'The same DQN agent played all games simultaneously.', isTrue: false, explanation: 'Each game was trained independently from scratch. The generality was in the algorithm and architecture, not in a single model learning all games at once.' },
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
