import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const document = [
  'Albert Einstein was born in Ulm, Germany.',
  'He developed the theory of relativity.',
  'His work revolutionized modern physics.',
  'Einstein received the Nobel Prize in 1921.',
];

export default function LateChunkingViz() {
  const [mode, setMode] = useState<'early' | 'late'>('early');
  const [hoveredChunk, setHoveredChunk] = useState<number | null>(null);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Late Chunking Visualization</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare: chunk-then-embed (early) vs embed-then-chunk (late).</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['early', 'late'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setHoveredChunk(null); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${mode === m ? '#C76B4A' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(199,107,74,0.08)' : 'transparent', color: mode === m ? '#C76B4A' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{m === 'early' ? 'Early Chunking' : 'Late Chunking'}</button>
        ))}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>
          Step 1: {mode === 'early' ? 'Chunk first' : 'Embed full document first'}
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem', border: mode === 'late' ? '2px solid #8BA888' : '1px solid #E5DFD3' }}>
          {document.map((sent, i) => (
            <span key={i} onMouseEnter={() => setHoveredChunk(i)} onMouseLeave={() => setHoveredChunk(null)} style={{
              padding: '0.15rem 0.3rem', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer',
              background: mode === 'early'
                ? (hoveredChunk === i ? 'rgba(199,107,74,0.2)' : `rgba(${i * 40 + 100},${150 + i * 20},${130 + i * 10},0.12)`)
                : (hoveredChunk === i ? 'rgba(139,168,136,0.25)' : 'transparent'),
              border: mode === 'early' ? `1px solid rgba(${i * 40 + 100},${150 + i * 20},${130 + i * 10},0.3)` : 'none',
              color: '#2C3E2D', display: 'inline', marginRight: '0.15rem',
            }}>{sent} </span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.3rem' }}>
          Step 2: {mode === 'early' ? 'Embed each chunk independently' : 'Split token embeddings into chunks'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem' }}>
          {document.map((sent, i) => (
            <div key={i} onMouseEnter={() => setHoveredChunk(i)} onMouseLeave={() => setHoveredChunk(null)} style={{
              padding: '0.4rem', borderRadius: '6px', cursor: 'pointer',
              border: `1px solid ${hoveredChunk === i ? (mode === 'early' ? '#C76B4A' : '#8BA888') : '#E5DFD3'}`,
              background: hoveredChunk === i ? (mode === 'early' ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.06)') : '#F0EBE1',
            }}>
              <div style={{ fontSize: '0.55rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.15rem' }}>Chunk {i + 1}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#5A6B5C' }}>
                {mode === 'early' ? `embed("${sent.slice(0, 20)}...")` : `pool(tokens[${i * 8}:${(i + 1) * 8}])`}
              </div>
              <div style={{ fontSize: '0.52rem', color: mode === 'early' ? '#C76B4A' : '#8BA888', marginTop: '0.1rem' }}>
                {mode === 'early' ? 'No cross-chunk context' : 'Has full document context'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: mode === 'early' ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.06)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        {mode === 'early' ? 'Early chunking: "He" in chunk 2 loses reference to "Einstein" — the embedding lacks context.' : 'Late chunking: "He" was embedded alongside "Einstein" first, so chunk 2 carries the coreference context.'}
      </div>
    </div>
  );
}
