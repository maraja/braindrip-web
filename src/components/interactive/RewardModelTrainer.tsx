import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PAIRS = [
  {
    prompt: 'What is machine learning?',
    a: 'Machine learning is a subset of AI where systems learn patterns from data to make predictions or decisions, improving automatically through experience without being explicitly programmed.',
    b: 'It\'s basically when computers learn stuff. Like AI and things. You know, robots and all that. Pretty cool technology that is used in many applications.',
    better: 'a' as const,
  },
  {
    prompt: 'How do I make pasta?',
    a: 'Boil water. Add pasta. Drain. Eat.',
    b: 'Bring a large pot of salted water to a rolling boil. Add pasta and cook for 8-10 minutes until al dente. Drain, reserving a cup of pasta water. Toss with your sauce, using pasta water to adjust consistency.',
    better: 'b' as const,
  },
  {
    prompt: 'Explain quantum computing.',
    a: 'Quantum computing uses qubits that can exist in superposition (both 0 and 1 simultaneously), enabling parallel computation. Key concepts include entanglement and quantum gates. While powerful for specific problems like factoring, they are not universally faster.',
    b: 'Quantum computing is the most revolutionary technology ever created. It will solve ALL problems and make classical computers completely obsolete within 5 years. Everyone should invest in quantum computing immediately.',
    better: 'a' as const,
  },
  {
    prompt: 'What causes rain?',
    a: 'Rain occurs when water vapor in the atmosphere condenses around tiny particles, forming droplets that grow heavy enough to fall. This happens when warm, moist air rises, cools, and reaches its dew point.',
    b: 'Water goes up then comes down. The sun heats water, it goes to clouds, then falls as rain. That\'s basically the water cycle which causes precipitation.',
    better: 'a' as const,
  },
  {
    prompt: 'Is coffee healthy?',
    a: 'Coffee is absolutely healthy and you should drink as much as possible. Studies prove it cures cancer and all diseases. There are zero downsides to unlimited coffee consumption.',
    b: 'Coffee has both benefits and risks. Moderate consumption (3-4 cups/day) is linked to reduced risk of type 2 diabetes and Parkinson\'s. However, excessive intake can cause anxiety, sleep disruption, and dependency. Individual tolerance varies.',
    better: 'b' as const,
  },
];

export default function RewardModelTrainer() {
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const done = choices.length >= 5;
  const correct = choices.filter((c, i) => c === PAIRS[i].better).length;

  const handleChoice = (choice: 'a' | 'b') => {
    if (current >= 5) return;
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    const acc = newChoices.filter((c, i) => c === PAIRS[i].better).length / newChoices.length;
    setScores([...scores, acc]);
    if (current < 4) setCurrent(current + 1);
  };

  const btLoss = done ? -Math.log(correct / 5 + 0.01).toFixed(3) : '—';

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Reward Model Trainer
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#6B7B6E', margin: '0.3rem 0 0' }}>Rank responses like a human annotator. Which response is better?</p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem' }}>
        {PAIRS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i < choices.length ? (choices[i] === PAIRS[i].better ? '#8BA888' : '#C76B4A') : '#E5DFD3',
          }} />
        ))}
      </div>

      {!done ? (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#D4A843', marginBottom: '0.8rem' }}>
            Pair {current + 1} of 5
          </div>
          <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888', marginBottom: '0.2rem' }}>Prompt</div>
            <div style={{ fontSize: '0.9rem', color: '#2C3E2D', fontWeight: 600 }}>{PAIRS[current].prompt}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            {(['a', 'b'] as const).map((key) => (
              <button key={key} onClick={() => handleChoice(key)} style={{
                padding: '1rem', borderRadius: '10px', border: '1px solid #E5DFD3', background: '#fff',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C76B4A'; e.currentTarget.style.background = 'rgba(199, 107, 74, 0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5DFD3'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#C76B4A', marginBottom: '0.4rem' }}>Response {key.toUpperCase()}</div>
                <div style={{ fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.5 }}>{PAIRS[current][key]}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.1rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>Training Complete</div>
            <div style={{ fontSize: '0.85rem', color: '#6B7B6E' }}>You agreed with the gold labels on {correct}/5 pairs</div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
            {[['Accuracy', `${(correct / 5 * 100).toFixed(0)}%`, '#8BA888'], ['BT Loss', btLoss as string, '#C76B4A'], ['Agreement', `${correct}/5`, '#D4A843']].map(([label, val, color]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7B6E' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Accuracy progression */}
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888', marginBottom: '0.4rem' }}>Accuracy Over Training</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px', background: 'rgba(44, 62, 45, 0.04)', borderRadius: '8px', padding: '0.5rem' }}>
            {scores.map((s, i) => (
              <div key={i} style={{ flex: 1, height: `${s * 100}%`, background: '#8BA888', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
            ))}
          </div>

          <button onClick={() => { setCurrent(0); setChoices([]); setScores([]); }} style={{
            marginTop: '1rem', padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: '#2C3E2D', color: '#FDFBF7', fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
          }}>Reset & Try Again</button>
        </div>
      )}
    </div>
  );
}
