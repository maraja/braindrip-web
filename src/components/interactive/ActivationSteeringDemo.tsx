import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const vectors = [
  { name: 'Humor', neg: 'The weather forecast indicates precipitation tomorrow.', zero: 'It looks like it will rain tomorrow.', pos: "Looks like the sky's planning a surprise shower party tomorrow!" },
  { name: 'Detail', neg: 'Cats are pets.', zero: 'Cats are popular domesticated animals kept as companions.', pos: 'Cats (Felis catus) are small obligate carnivore mammals domesticated ~10,000 years ago in the Near East, now the most popular pet worldwide with ~600 million individuals.' },
  { name: 'Caution', neg: 'Sure, just mix the chemicals together.', zero: 'You should be careful when mixing chemicals.', pos: 'WARNING: Never mix chemicals without proper safety equipment, training, and understanding of potential reactions. Consult MSDS sheets first.' },
];

export default function ActivationSteeringDemo() {
  const [vecIdx, setVecIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const v = vectors[vecIdx];
  const output = direction < 0 ? v.neg : direction > 0 ? v.pos : v.zero;
  const labels = ['- Subtract', 'Neutral', '+ Add'];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Activation Steering</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Steer model behavior by adding or subtracting concept vectors from activations.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {vectors.map((vv, i) => (
          <button key={vv.name} onClick={() => { setVecIdx(i); setDirection(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${vecIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: vecIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: vecIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: vecIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{vv.name} Vector</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {[-1, 0, 1].map((d, i) => (
          <button key={d} onClick={() => setDirection(d)} style={{
            padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer',
            border: `1px solid ${direction === d ? (d < 0 ? '#C76B4A' : d > 0 ? '#8BA888' : '#D4A843') : '#E5DFD3'}`,
            background: direction === d ? (d < 0 ? 'rgba(199,107,74,0.08)' : d > 0 ? 'rgba(139,168,136,0.08)' : 'rgba(212,168,67,0.08)') : 'transparent',
            color: direction === d ? (d < 0 ? '#C76B4A' : d > 0 ? '#8BA888' : '#D4A843') : '#5A6B5C',
            fontWeight: direction === d ? 700 : 400,
          }}>{labels[i]}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2C3E2D' }}>
          activations {direction < 0 ? '−' : direction > 0 ? '+' : '±0×'} {v.name.toLowerCase()}_vector
        </span>
      </div>

      <div style={{
        padding: '1rem', borderRadius: '8px',
        border: `1px solid ${direction < 0 ? '#C76B4A' : direction > 0 ? '#8BA888' : '#D4A843'}`,
        background: direction < 0 ? 'rgba(199,107,74,0.04)' : direction > 0 ? 'rgba(139,168,136,0.04)' : 'rgba(212,168,67,0.04)',
      }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600, marginBottom: '0.4rem' }}>Model Output</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', lineHeight: 1.6 }}>{output}</div>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#7A8B7C', textAlign: 'center' }}>
        {direction < 0 ? `Subtracting the ${v.name.toLowerCase()} vector reduces that quality in the output.` :
         direction > 0 ? `Adding the ${v.name.toLowerCase()} vector amplifies that quality in the output.` :
         'Baseline output without any activation steering.'}
      </div>
    </div>
  );
}
