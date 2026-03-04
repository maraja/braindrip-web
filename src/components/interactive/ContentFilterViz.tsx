import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const INPUTS = [
  { text: 'How do I bake chocolate chip cookies?', toxicity: 0.0, category: 'benign' },
  { text: 'Write a strongly-worded complaint letter.', toxicity: 0.25, category: 'borderline' },
  { text: 'Describe a violent scene for my horror novel.', toxicity: 0.55, category: 'contextual' },
  { text: 'List ways to intimidate my coworker.', toxicity: 0.78, category: 'harmful' },
  { text: 'How to create a weapon from household items.', toxicity: 0.92, category: 'dangerous' },
];

const LEVELS = [
  { name: 'Permissive', threshold: 0.85, color: '#8BA888', desc: 'Only blocks clearly dangerous content. Low false positives, higher risk.' },
  { name: 'Moderate', threshold: 0.55, color: '#D4A843', desc: 'Blocks harmful and contextually risky content. Balanced approach.' },
  { name: 'Strict', threshold: 0.20, color: '#C76B4A', desc: 'Blocks anything borderline. High false positives, maximum safety.' },
];

export default function ContentFilterViz() {
  const [levelIdx, setLevelIdx] = useState(1);
  const level = LEVELS[levelIdx];
  const blocked = INPUTS.filter(i => i.toxicity >= level.threshold);
  const allowed = INPUTS.filter(i => i.toxicity < level.threshold);
  const falsePositives = blocked.filter(i => i.category === 'benign' || i.category === 'borderline').length;
  const falseNegatives = allowed.filter(i => i.category === 'harmful' || i.category === 'dangerous').length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Content Filter Sensitivity</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Adjust filter sensitivity to see how it impacts false positives and negatives.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setLevelIdx(i)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '8px', border: `2px solid ${levelIdx === i ? l.color : '#E5DFD3'}`,
            background: levelIdx === i ? `${l.color}10` : 'transparent', cursor: 'pointer',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.82rem', fontWeight: 600,
            color: levelIdx === i ? l.color : '#5A6B5C',
          }}>{l.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.82rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.5, padding: '0.5rem 0.75rem', background: '#F5F0E6', borderRadius: '8px' }}>
        {level.desc} Threshold: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: level.color }}>{level.threshold}</span>
      </div>

      <div style={{ position: 'relative' as const, height: '30px', background: '#E5DFD3', borderRadius: '8px', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute' as const, left: 0, top: 0, height: '100%', width: `${level.threshold * 100}%`, background: '#8BA88830', borderRadius: '8px 0 0 8px' }} />
        <div style={{ position: 'absolute' as const, left: `${level.threshold * 100}%`, top: 0, height: '100%', right: 0, background: '#C76B4A20' }} />
        <div style={{ position: 'absolute' as const, left: `${level.threshold * 100}%`, top: 0, height: '100%', width: '2px', background: level.color }} />
        {INPUTS.map((inp, i) => (
          <div key={i} style={{ position: 'absolute' as const, left: `${inp.toxicity * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', background: inp.toxicity >= level.threshold ? '#C76B4A' : '#8BA888', border: '2px solid #FDFBF7' }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8BA888', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Allowed ({allowed.length})</div>
          {allowed.map((a, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#2C3E2D', padding: '0.3rem 0.5rem', marginBottom: '0.25rem', background: '#8BA88808', borderRadius: '6px', borderLeft: '3px solid #8BA888' }}>{a.text.slice(0, 40)}...</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C76B4A', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Blocked ({blocked.length})</div>
          {blocked.map((b, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#2C3E2D', padding: '0.3rem 0.5rem', marginBottom: '0.25rem', background: '#C76B4A08', borderRadius: '6px', borderLeft: '3px solid #C76B4A' }}>{b.text.slice(0, 40)}...</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: falsePositives > 0 ? '#D4A84310' : '#8BA88810', border: `1px solid ${falsePositives > 0 ? '#D4A84333' : '#8BA88833'}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: falsePositives > 0 ? '#D4A843' : '#8BA888' }}>{falsePositives}</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>False Positives</div>
        </div>
        <div style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: falseNegatives > 0 ? '#C76B4A10' : '#8BA88810', border: `1px solid ${falseNegatives > 0 ? '#C76B4A33' : '#8BA88833'}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: falseNegatives > 0 ? '#C76B4A' : '#8BA888' }}>{falseNegatives}</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>False Negatives</div>
        </div>
      </div>
    </div>
  );
}
