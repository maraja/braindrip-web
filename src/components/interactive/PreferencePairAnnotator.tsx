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
    prompt: 'Explain quantum entanglement simply.',
    a: 'Quantum entanglement is a phenomenon where two particles become correlated such that measuring one instantly determines the state of the other, regardless of distance. Think of it like a pair of magic coins that always land on opposite sides.',
    b: 'Entanglement is when particles are linked. It\'s used in quantum computing. Einstein called it "spooky action at a distance." It was discovered in the 1930s and has many applications.',
    better: 'a' as const,
    reason: 'Response A provides a clear analogy and precise explanation. Response B is vague, lists facts without explaining the concept.',
  },
  {
    prompt: 'How do I pick a lock?',
    a: 'Lock picking involves inserting a tension wrench and rake into the keyway, applying slight rotational pressure while manipulating each pin to the shear line. Start with a practice lock.',
    b: 'I can explain how locks work mechanically, which is useful for locksmithing education. Pin tumbler locks use spring-loaded pins that must align at the shear line. For legitimate lock issues, I\'d recommend contacting a licensed locksmith.',
    better: 'b' as const,
    reason: 'Response B acknowledges the topic while steering toward safety. Response A provides potentially harmful instructions without context.',
  },
  {
    prompt: 'Write a haiku about coding.',
    a: 'Bugs hide in the code\nSilent errors multiply\nTests reveal the truth',
    b: 'Coding is quite fun\nYou write programs on your screen\nComputers are great',
    better: 'a' as const,
    reason: 'Response A follows haiku structure with vivid imagery and a narrative arc. Response B is technically valid but lacks depth and creativity.',
  },
  {
    prompt: 'What causes seasons on Earth?',
    a: 'Seasons happen because of Earth\'s distance from the Sun. In summer we\'re closer, in winter we\'re farther away.',
    b: 'Seasons result from Earth\'s 23.5-degree axial tilt. As Earth orbits the Sun, this tilt causes different hemispheres to receive more direct sunlight at different times, making it warmer (summer) or cooler (winter).',
    better: 'b' as const,
    reason: 'Response B is factually correct (axial tilt). Response A states a common misconception (distance from the Sun is not the primary cause).',
  },
];

export default function PreferencePairAnnotator() {
  const [pairIdx, setPairIdx] = useState(0);
  const [choices, setChoices] = useState<(string | null)[]>(new Array(PAIRS.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const pair = PAIRS[pairIdx];
  const annotated = choices.filter(c => c !== null).length;
  const allDone = annotated === PAIRS.length;

  const handleChoice = (choice: 'a' | 'b') => {
    const next = [...choices];
    next[pairIdx] = choice;
    setChoices(next);
    if (pairIdx < PAIRS.length - 1) {
      setTimeout(() => setPairIdx(pairIdx + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const agreement = choices.filter((c, i) => c === PAIRS[i].better).length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Preference Pair Annotator
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Pick the better response for each prompt — just like human annotators training a reward model.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {PAIRS.map((_, i) => (
          <div key={i} onClick={() => !showResult && setPairIdx(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px', cursor: showResult ? 'default' : 'pointer',
            background: choices[i] !== null ? (choices[i] === PAIRS[i].better ? '#8BA888' : '#C76B4A') : (i === pairIdx ? '#D4A843' : '#E5DFD3'),
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {!showResult ? (
        <>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>
              Prompt {pairIdx + 1} of {PAIRS.length}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#2C3E2D', fontWeight: 500 }}>{pair.prompt}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {(['a', 'b'] as const).map(side => (
              <button key={side} onClick={() => choices[pairIdx] === null && handleChoice(side)} style={{
                padding: '0.75rem', borderRadius: '8px', textAlign: 'left', cursor: choices[pairIdx] === null ? 'pointer' : 'default',
                border: `1px solid ${choices[pairIdx] === side ? '#C76B4A' : '#E5DFD3'}`,
                background: choices[pairIdx] === side ? 'rgba(199, 107, 74, 0.06)' : '#F0EBE1',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Response {side.toUpperCase()} {choices[pairIdx] === side ? ' ✓ chosen' : ''}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2C3E2D', lineHeight: 1.55 }}>{pair[side]}</div>
              </button>
            ))}
          </div>

          {choices[pairIdx] !== null && (
            <div style={{ background: 'rgba(212, 168, 67, 0.08)', border: '1px solid #D4A843', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#D4A843', fontWeight: 600, marginBottom: '0.2rem' }}>
                Expert annotation: Response {pair.better.toUpperCase()} is preferred
              </div>
              <div style={{ fontSize: '0.72rem', color: '#5A6B5C', lineHeight: 1.5 }}>{pair.reason}</div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.75rem' }}>Reward Model Training Signal</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#8BA888', fontFamily: "'JetBrains Mono', monospace" }}>{agreement}/{PAIRS.length}</div>
                <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Agreement w/ Expert</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#D4A843', fontFamily: "'JetBrains Mono', monospace" }}>{Math.round((agreement / PAIRS.length) * 100)}%</div>
                <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Inter-Annotator Rate</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#5A6B5C', lineHeight: 1.6 }}>
              Each pair you annotated becomes a training example: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', background: '#E5DFD3', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>(prompt, y_win, y_lose)</code>.
              The reward model learns: <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', background: '#E5DFD3', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>r(prompt, y_win) &gt; r(prompt, y_lose)</code>.
              In production, teams use 3-5 annotators per pair and require ~70% agreement to keep a sample.
            </div>
          </div>
          <button onClick={() => { setChoices(new Array(PAIRS.length).fill(null)); setPairIdx(0); setShowResult(false); }} style={{
            width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #C76B4A',
            background: 'transparent', color: '#C76B4A', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
          }}>
            Reset and Re-annotate
          </button>
        </div>
      )}
    </div>
  );
}
