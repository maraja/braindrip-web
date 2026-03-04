import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTreeOfThought() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🌳', label: 'Decision Tree', text: 'Chain-of-thought follows one path start to finish. Tree of Thought (ToT) explores multiple branches at each decision point, like a choose-your-own-adventure book where you read all paths before picking the best ending. At each reasoning step, the model generates several possible continuations, evaluates which are most promising, and prunes dead ends — bringing systematic search to language model reasoning.' },
    { emoji: '🗺️', label: 'GPS Navigation', text: 'GPS doesn\'t just take the first road — it evaluates multiple routes and picks the best one. ToT evaluates multiple reasoning paths: "Approach A leads to a dead end... Approach B is promising but complex... Approach C solves it!" By explicitly exploring and evaluating different thinking strategies, the model can solve problems that linear chain-of-thought gets stuck on.' },
    { emoji: '♟️', label: 'Game Tree Search', text: 'Chess engines explore a tree of possible moves, evaluate positions, and backtrack from bad lines. Tree of Thought applies the same principle to language model reasoning. A BFS or DFS strategy explores different thought branches, a value function evaluates how promising each branch is, and the search backtracks from unproductive paths. This structured exploration significantly improves performance on puzzles, planning, and creative tasks.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
