import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAlignmentProblem() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧞', label: 'Genie\'s Wish', text: 'The alignment problem is the genie problem: you get exactly what you asked for, not what you meant. "Make me the richest person" might involve terrible means. Aligning AI means ensuring it understands and pursues human intentions, values, and preferences — not just the literal objective. This is hard because human values are complex, context-dependent, and sometimes contradictory.' },
    { emoji: '🐕', label: 'Training a Dog', text: 'You want the dog to fetch the newspaper, but you reward it for bringing paper-like things. It tears up books instead. The alignment problem: the reward signal (treats for paper) doesn\'t perfectly capture your actual goal (bring the newspaper nicely). AI systems optimize whatever objective we specify, and specifying human values precisely enough for an optimizer to pursue them correctly is extraordinarily difficult.' },
    { emoji: '🗺️', label: 'Map vs Territory', text: 'Our specified objectives are a map; human values are the territory. The alignment problem is that the map never perfectly matches the territory. RLHF attempts to learn the territory from human feedback, but the map still has gaps: edge cases, value conflicts, cultural differences, and situations humans haven\'t considered. As models get more capable, even small map-territory mismatches can lead to increasingly problematic behavior.' },
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
