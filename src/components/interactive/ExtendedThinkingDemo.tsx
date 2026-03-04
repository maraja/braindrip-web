import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BUDGETS = [
  {
    level: 'Low',
    thinkTokens: 48,
    outputTokens: 32,
    thinking: 'The question asks about probability.\nP = favorable / total.\n6 × 6 = 36 total outcomes.\nSum of 7... I think there are 6 ways.\n6/36 = 1/6.',
    answer: 'The probability of rolling a sum of 7 with two dice is 1/6.',
    quality: 'Correct',
    qualityColor: '#8BA888',
  },
  {
    level: 'Medium',
    thinkTokens: 112,
    outputTokens: 58,
    thinking: 'Two fair dice are thrown. I need P(sum = 7).\nTotal outcomes: 6 × 6 = 36.\nLet me enumerate favorable outcomes:\n(1,6), (2,5), (3,4), (4,3), (5,2), (6,1).\nThat\'s 6 favorable outcomes.\nP = 6/36 = 1/6 ≈ 0.1667.\nLet me verify: 7 is the most common sum with two dice, which aligns with 6 being the maximum count for any sum.',
    answer: 'The probability is 1/6 (approximately 16.67%).\n\nWith two fair dice there are 36 equally likely outcomes. Exactly 6 produce a sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), and (6,1). So P(sum=7) = 6/36 = 1/6.',
    quality: 'Correct + Verified',
    qualityColor: '#D4A843',
  },
  {
    level: 'High',
    thinkTokens: 224,
    outputTokens: 86,
    thinking: 'I need to find P(sum = 7) for two fair six-sided dice.\n\nFirst, the sample space: each die has 6 faces, so |S| = 6² = 36.\n\nNow I\'ll systematically list all pairs (a, b) where a + b = 7:\n• a=1: b=6 → (1,6) ✓\n• a=2: b=5 → (2,5) ✓\n• a=3: b=4 → (3,4) ✓\n• a=4: b=3 → (4,3) ✓\n• a=5: b=2 → (5,2) ✓\n• a=6: b=1 → (6,1) ✓\n• a=7: impossible (max die value is 6)\n\nSo |favorable| = 6.\n\nSanity check: For sum = k where 2 ≤ k ≤ 12, the number of ways = 6 − |k − 7|. For k=7: 6 − 0 = 6. ✓\n\nAnother check: sum of all ways should be 36.\nk: 2(1) + 3(2) + 4(3) + 5(4) + 6(5) + 7(6) + 8(5) + 9(4) + 10(3) + 11(2) + 12(1) = 36. ✓\n\nP = 6/36 = 1/6.',
    answer: 'The probability of rolling a sum of 7 with two fair dice is 1/6 (≈ 16.67%).\n\nWith 36 total outcomes (6 × 6), there are exactly 6 favorable pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). This makes 7 the most probable sum, as the count formula 6 − |k − 7| peaks at k = 7. Therefore P(sum = 7) = 6/36 = 1/6.',
    quality: 'Correct + Verified + Generalized',
    qualityColor: '#C76B4A',
  },
];

export default function ExtendedThinkingDemo() {
  const [budget, setBudget] = useState(1);
  const [showThinking, setShowThinking] = useState(false);
  const b = BUDGETS[budget];
  const totalTokens = b.thinkTokens + b.outputTokens;
  const thinkPct = Math.round((b.thinkTokens / totalTokens) * 100);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Extended Thinking Demo
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Adjust compute budget to see how more thinking tokens improve answer quality.
        </p>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Problem</div>
        <div style={{ fontSize: '0.85rem', color: '#2C3E2D', fontWeight: 500 }}>What is the probability of rolling a sum of 7 with two fair dice?</div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#5A6B5C', marginBottom: '0.4rem' }}>Compute Budget: <strong style={{ color: b.qualityColor }}>{b.level}</strong></div>
        <input type="range" min={0} max={2} value={budget} onChange={e => { setBudget(Number(e.target.value)); setShowThinking(false); }}
          style={{ width: '100%', accentColor: '#C76B4A', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#7A8B7C' }}>
          <span>Low</span><span>Medium</span><span>High</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Thinking Tokens', value: b.thinkTokens, color: '#D4A843' },
          { label: 'Output Tokens', value: b.outputTokens, color: '#8BA888' },
          { label: 'Think Ratio', value: `${thinkPct}%`, color: '#C76B4A' },
        ].map(m => (
          <div key={m.label} style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <button onClick={() => setShowThinking(!showThinking)} style={{
          width: '100%', padding: '0.5rem', borderRadius: '6px',
          border: '1px solid #D4A843', background: showThinking ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
          color: '#D4A843', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {showThinking ? '▾ Hide' : '▸ Reveal'} Internal Thinking ({b.thinkTokens} tokens)
        </button>
        {showThinking && (
          <pre style={{ background: '#F0EBE1', borderRadius: '0 0 8px 8px', padding: '0.75rem', margin: 0,
            fontSize: '0.7rem', color: '#5A6B5C', fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'pre-wrap', lineHeight: 1.55, borderTop: '1px dashed #D4A843',
          }}>{b.thinking}</pre>
        )}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.3rem' }}>Final Answer</div>
        <pre style={{ fontSize: '0.75rem', color: '#2C3E2D', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{b.answer}</pre>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: `${b.qualityColor}11`, borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
        <span style={{ fontSize: '0.85rem' }}>●</span>
        <span style={{ fontSize: '0.78rem', color: b.qualityColor, fontWeight: 600 }}>{b.quality}</span>
        <div style={{ flex: 1, height: '4px', background: '#E5DFD3', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${(budget + 1) * 33}%`, height: '100%', background: b.qualityColor, borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
      </div>
    </div>
  );
}
