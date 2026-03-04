import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PASSAGES = [
  {
    context: 'Marie Curie was a physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, and the only person to win Nobel Prizes in two different sciences (Physics 1903, Chemistry 1911).',
    sentences: [
      { text: 'Marie Curie was a physicist and chemist.', hallucinated: false },
      { text: 'She won the Nobel Prize in Physics in 1903.', hallucinated: false },
      { text: 'She also won the Nobel Prize in Chemistry in 1911.', hallucinated: false },
      { text: 'She was born in Warsaw, Poland in 1867.', hallucinated: true, reason: 'While factually true, this is extrinsic — not stated in the provided context.' },
      { text: 'She was the first person to win two Nobel Prizes.', hallucinated: true, reason: 'The context says "only person to win in two different sciences," not "first to win two." Subtle but inaccurate rephrasing.' },
    ],
  },
  {
    context: 'The Great Wall of China is a series of fortifications made of stone, brick, and other materials. It was built over many centuries by various Chinese dynasties to protect against nomadic invasions.',
    sentences: [
      { text: 'The Great Wall is made of stone, brick, and other materials.', hallucinated: false },
      { text: 'It was built to protect against nomadic invasions.', hallucinated: false },
      { text: 'The wall stretches over 13,000 miles.', hallucinated: true, reason: 'This length is not mentioned in the provided context — extrinsic hallucination.' },
      { text: 'It was built over many centuries.', hallucinated: false },
      { text: 'It is visible from space with the naked eye.', hallucinated: true, reason: 'This popular myth is not in the context, and is also factually false — a doubly problematic hallucination.' },
    ],
  },
];

export default function HallucinationDetector() {
  const [passIdx, setPassIdx] = useState(0);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState(false);
  const passage = PASSAGES[passIdx];

  const toggle = (i: number) => { if (!revealed) setSelected(prev => ({ ...prev, [i]: !prev[i] })); };
  const reset = (i: number) => { setPassIdx(i); setSelected({}); setRevealed(false); };

  const totalHallucinated = passage.sentences.filter(s => s.hallucinated).length;
  const correctPicks = passage.sentences.filter((s, i) => s.hallucinated && selected[i]).length;
  const falsePicks = passage.sentences.filter((s, i) => !s.hallucinated && selected[i]).length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Spot the Hallucination</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Read the source, then click on sentences you think are hallucinated.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {PASSAGES.map((_, i) => (
          <button key={i} onClick={() => reset(i)} style={{ padding: '0.35rem 0.7rem', borderRadius: '6px', border: '1px solid #E5DFD3', cursor: 'pointer', background: passIdx === i ? '#2C3E2D' : 'transparent', color: passIdx === i ? '#FDFBF7' : '#5A6B5C', fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.78rem', fontWeight: 600 }}>Passage {i + 1}</button>
        ))}
      </div>

      <div style={{ background: '#F5F0E6', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Source Context</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.7 }}>{passage.context}</div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#8B9B8D', marginBottom: '0.5rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Model Output — click suspected hallucinations</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem', marginBottom: '1rem' }}>
        {passage.sentences.map((s, i) => {
          const bg = revealed ? (s.hallucinated ? '#C76B4A12' : '#8BA88812') : (selected[i] ? '#D4A84315' : 'transparent');
          const border = revealed ? (s.hallucinated ? '#C76B4A44' : '#8BA88844') : (selected[i] ? '#D4A84366' : '#E5DFD3');
          return (
            <div key={i} onClick={() => toggle(i)} style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: `1px solid ${border}`, background: bg, cursor: revealed ? 'default' : 'pointer', fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6, transition: 'all 0.2s' }}>
              {s.text}
              {revealed && s.hallucinated && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: '#C76B4A', fontStyle: 'italic' }}>{s.reason}</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setRevealed(true)} disabled={revealed} style={{ padding: '0.45rem 1.2rem', borderRadius: '8px', border: 'none', background: revealed ? '#C5BFB3' : '#2C3E2D', color: '#FDFBF7', cursor: revealed ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>Reveal Answers</button>
        {revealed && (
          <span style={{ fontSize: '0.82rem', color: '#2C3E2D', fontWeight: 600 }}>
            {correctPicks}/{totalHallucinated} found{falsePicks > 0 ? `, ${falsePicks} false alarm${falsePicks > 1 ? 's' : ''}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
