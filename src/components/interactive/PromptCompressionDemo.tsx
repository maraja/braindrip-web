import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const tokens = [
  { text: 'You', importance: 0.3 }, { text: ' are', importance: 0.2 }, { text: ' a', importance: 0.1 },
  { text: ' helpful', importance: 0.7 }, { text: ' AI', importance: 0.9 }, { text: ' assistant', importance: 0.85 },
  { text: '.', importance: 0.05 }, { text: ' Please', importance: 0.15 }, { text: ' analyze', importance: 0.95 },
  { text: ' the', importance: 0.1 }, { text: ' following', importance: 0.2 }, { text: ' quarterly', importance: 0.8 },
  { text: ' financial', importance: 0.88 }, { text: ' report', importance: 0.82 }, { text: ' and', importance: 0.15 },
  { text: ' provide', importance: 0.6 }, { text: ' a', importance: 0.05 }, { text: ' detailed', importance: 0.55 },
  { text: ' summary', importance: 0.92 }, { text: ' of', importance: 0.1 }, { text: ' key', importance: 0.75 },
  { text: ' trends', importance: 0.85 }, { text: '.', importance: 0.05 }, { text: ' The', importance: 0.1 },
  { text: ' report', importance: 0.4 }, { text: ' covers', importance: 0.3 }, { text: ' revenue', importance: 0.9 },
  { text: ',', importance: 0.05 }, { text: ' expenses', importance: 0.88 }, { text: ',', importance: 0.05 },
  { text: ' profit', importance: 0.92 }, { text: ' margins', importance: 0.85 }, { text: ',', importance: 0.05 },
  { text: ' and', importance: 0.1 }, { text: ' growth', importance: 0.87 }, { text: ' projections', importance: 0.9 },
  { text: '.', importance: 0.05 },
];

const ratios = [1, 2, 4, 8];

export default function PromptCompressionDemo() {
  const [ratio, setRatio] = useState(1);

  const threshold = ratio === 1 ? 0 : ratio === 2 ? 0.3 : ratio === 4 ? 0.6 : 0.8;
  const kept = tokens.filter(t => t.importance >= threshold);
  const originalCount = tokens.length;
  const compressedCount = kept.length;
  const costPerToken = 0.00003;

  const getColor = (importance: number) => {
    if (importance >= 0.85) return '#C76B4A';
    if (importance >= 0.6) return '#D4A843';
    if (importance >= 0.3) return '#8BA888';
    return '#B5AFA3';
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prompt Compression (LLMLingua)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Tokens colored by importance. Adjust compression ratio to remove low-importance tokens.
        </p>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Compression Ratio
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {ratios.map(r => (
            <button key={r} onClick={() => setRatio(r)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '6px',
              border: `1px solid ${ratio === r ? '#C76B4A' : '#E5DFD3'}`,
              background: ratio === r ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
              color: ratio === r ? '#C76B4A' : '#5A6B5C',
              fontWeight: ratio === r ? 600 : 400,
              fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            }}>
              {r}x
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', lineHeight: 1.8 }}>
        {tokens.map((t, i) => {
          const removed = t.importance < threshold;
          return (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem',
              padding: '0.12rem 0.08rem', borderRadius: '3px',
              background: removed ? 'transparent' : `${getColor(t.importance)}18`,
              color: removed ? '#D4CFC4' : getColor(t.importance),
              textDecoration: removed ? 'line-through' : 'none',
              fontWeight: t.importance >= 0.8 ? 600 : 400,
              transition: 'all 0.3s ease',
            }}>
              {t.text}
            </span>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Tokens</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#2C3E2D' }}>
            {compressedCount}/{originalCount}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Reduction</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#C76B4A' }}>
            {Math.round((1 - compressedCount / originalCount) * 100)}%
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Cost Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>
            ${((originalCount - compressedCount) * costPerToken * 1000).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C' }}>per 1K calls</div>
        </div>
      </div>
    </div>
  );
}
