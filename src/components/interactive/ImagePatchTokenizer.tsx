import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const colors = ['#C76B4A', '#D4A843', '#8BA888', '#6E8B6B', '#5A6B5C', '#9B7A5B', '#7B9BAA', '#AA7B9B'];

export default function ImagePatchTokenizer() {
  const [patchSize, setPatchSize] = useState(4);
  const gridSize = 16;
  const patches = gridSize / patchSize;
  const totalPatches = patches * patches;

  const [hoveredPatch, setHoveredPatch] = useState<number | null>(null);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Image Patch Tokenization</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how images are split into patches, each becoming a token for the transformer.</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.78rem', color: '#5A6B5C', fontWeight: 600 }}>Patch size: {patchSize}x{patchSize} pixels → {totalPatches} tokens</label>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
          {[2, 4, 8].map(s => (
            <button key={s} onClick={() => { setPatchSize(s); setHoveredPatch(null); }} style={{
              padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${patchSize === s ? '#C76B4A' : '#E5DFD3'}`,
              background: patchSize === s ? 'rgba(199,107,74,0.08)' : 'transparent', color: patchSize === s ? '#C76B4A' : '#5A6B5C',
              fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', fontWeight: patchSize === s ? 600 : 400,
            }}>{s}x{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${patches}, 1fr)`, gap: '1px', background: '#E5DFD3', border: '2px solid #2C3E2D', borderRadius: '4px', overflow: 'hidden', width: '200px', height: '200px', flexShrink: 0 }}>
          {Array.from({ length: totalPatches }).map((_, i) => (
            <div key={i} onMouseEnter={() => setHoveredPatch(i)} onMouseLeave={() => setHoveredPatch(null)} style={{
              background: hoveredPatch === i ? '#C76B4A' : colors[i % colors.length] + '40',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: totalPatches > 16 ? '0.45rem' : '0.6rem', color: hoveredPatch === i ? '#fff' : '#5A6B5C',
              fontFamily: "'JetBrains Mono', monospace", transition: 'background 0.15s',
            }}>{i}</div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>Token Sequence</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
            {Array.from({ length: Math.min(totalPatches, 32) }).map((_, i) => (
              <span key={i} style={{
                padding: '0.15rem 0.35rem', borderRadius: '3px', fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace",
                background: hoveredPatch === i ? '#C76B4A' : '#F0EBE1', color: hoveredPatch === i ? '#fff' : '#5A6B5C',
              }}>p{i}</span>
            ))}
            {totalPatches > 32 && <span style={{ fontSize: '0.6rem', color: '#7A8B7C' }}>...+{totalPatches - 32}</span>}
          </div>

          <div style={{ marginTop: '0.75rem', background: '#F0EBE1', borderRadius: '6px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#2C3E2D' }}>
              {hoveredPatch !== null
                ? `Patch ${hoveredPatch}: rows ${Math.floor(hoveredPatch / patches) * patchSize}-${Math.floor(hoveredPatch / patches) * patchSize + patchSize - 1}, cols ${(hoveredPatch % patches) * patchSize}-${(hoveredPatch % patches) * patchSize + patchSize - 1}`
                : `${totalPatches} patches, each ${patchSize}x${patchSize} pixels. Hover to inspect.`}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#5A6B5C' }}>
        Smaller patches = more tokens = finer detail but higher compute cost. ViT-L/14 uses 14x14 patches.
      </div>
    </div>
  );
}
