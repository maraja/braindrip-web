import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

function computeMetrics(chunkSize: number, overlap: number) {
  const docTokens = 10000;
  const effectiveSize = chunkSize - overlap;
  const numChunks = Math.ceil(docTokens / effectiveSize);
  const avgRelevance = chunkSize <= 256 ? 0.82 : chunkSize <= 512 ? 0.78 : chunkSize <= 1024 ? 0.68 : 0.55;
  const contextRetention = chunkSize <= 256 ? 0.45 : chunkSize <= 512 ? 0.72 : chunkSize <= 1024 ? 0.85 : 0.92;
  const overlapBonus = overlap > 0 ? Math.min(overlap / chunkSize, 0.25) * 0.15 : 0;
  const retrievalQuality = (avgRelevance * 0.6 + contextRetention * 0.4 + overlapBonus);
  const storageOverhead = overlap > 0 ? ((numChunks * chunkSize) / docTokens * 100 - 100) : 0;
  return { numChunks, avgRelevance, contextRetention, retrievalQuality: Math.min(1, retrievalQuality), storageOverhead };
}

const sizeStops = [128, 256, 512, 768, 1024, 1536, 2048];

export default function ChunkSizeExplorer() {
  const [chunkSize, setChunkSize] = useState(512);
  const [overlap, setOverlap] = useState(50);

  const metrics = computeMetrics(chunkSize, overlap);
  const maxOverlap = Math.floor(chunkSize * 0.5);

  const qualityCurve = sizeStops.map(size => ({
    size,
    quality: computeMetrics(size, overlap).retrievalQuality,
  }));

  const maxQ = Math.max(...qualityCurve.map(p => p.quality));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Chunk Size Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore how chunk size and overlap affect retrieval quality for a 10,000-token document.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>Chunk Size (tokens)</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>{chunkSize}</span>
          </div>
          <input type="range" min={128} max={2048} step={64} value={chunkSize}
            onChange={e => { setChunkSize(parseInt(e.target.value)); setOverlap(Math.min(overlap, Math.floor(parseInt(e.target.value) * 0.5))); }}
            style={{ width: '100%', height: '6px', appearance: 'none', WebkitAppearance: 'none', background: 'linear-gradient(to right, #8BA888, #D4A843, #C76B4A)', borderRadius: '3px', outline: 'none', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#B0A898' }}>
            <span>128</span><span>2048</span>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2C3E2D' }}>Overlap (tokens)</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 600, color: '#2C3E2D' }}>{overlap}</span>
          </div>
          <input type="range" min={0} max={maxOverlap} step={10} value={Math.min(overlap, maxOverlap)}
            onChange={e => setOverlap(parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', appearance: 'none', WebkitAppearance: 'none', background: 'linear-gradient(to right, #8BA888, #D4A843)', borderRadius: '3px', outline: 'none', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#B0A898' }}>
            <span>0</span><span>{maxOverlap}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Chunks', value: metrics.numChunks.toString(), color: '#2C3E2D' },
          { label: 'Avg Relevance', value: `${(metrics.avgRelevance * 100).toFixed(0)}%`, color: '#8BA888' },
          { label: 'Context Kept', value: `${(metrics.contextRetention * 100).toFixed(0)}%`, color: '#D4A843' },
          { label: 'Storage +', value: `${metrics.storageOverhead.toFixed(0)}%`, color: '#C76B4A' },
        ].map(m => (
          <div key={m.label} style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.15rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#7A8B7C' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Retrieval Quality vs Chunk Size</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem', height: '100px', marginBottom: '0.5rem' }}>
        {qualityCurve.map(p => {
          const isActive = p.size === chunkSize;
          const barHeight = (p.quality / maxQ) * 100;
          return (
            <div key={p.size} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: isActive ? '#C76B4A' : '#B0A898' }}>
                {(p.quality * 100).toFixed(0)}
              </span>
              <div style={{
                width: '100%', height: `${barHeight}%`, borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease',
                background: isActive ? 'linear-gradient(180deg, #C76B4A, #D4896D)' : 'linear-gradient(180deg, #8BA888, #A8C4A5)',
                border: isActive ? '2px solid #C76B4A' : 'none',
              }} />
              <span style={{ fontSize: '0.6rem', color: isActive ? '#C76B4A' : '#B0A898', fontWeight: isActive ? 700 : 400 }}>{p.size}</span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        <strong>Insight:</strong> {chunkSize <= 256 ? 'Small chunks have high relevance precision but lose surrounding context. Good for fact-based QA.' :
          chunkSize <= 512 ? 'The 256-512 range often provides the best balance between relevance and context retention.' :
          chunkSize <= 1024 ? 'Larger chunks retain more context but include more irrelevant content, diluting retrieval precision.' :
          'Very large chunks approach full-document retrieval, sacrificing precision for completeness.'}
      </div>
    </div>
  );
}
