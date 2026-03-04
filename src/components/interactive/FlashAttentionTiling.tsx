import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const GRID = 4;
const TILE = 48;

export default function FlashAttentionTiling() {
  const [tileRow, setTileRow] = useState(0);
  const [tileCol, setTileCol] = useState(0);
  const [mode, setMode] = useState<'standard' | 'flash'>('flash');

  const advance = () => {
    if (mode === 'flash') {
      if (tileCol < GRID - 1) setTileCol(tileCol + 1);
      else if (tileRow < GRID - 1) { setTileRow(tileRow + 1); setTileCol(0); }
    }
  };
  const reset = () => { setTileRow(0); setTileCol(0); };
  const done = mode === 'flash' && tileRow === GRID - 1 && tileCol === GRID - 1;
  const tilesProcessed = tileRow * GRID + tileCol + 1;

  const renderMatrix = (label: string, color: string, highlightRow: boolean, highlightCol: boolean) => (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, ${TILE}px)`, gap: '2px' }}>
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const r = Math.floor(i / GRID), c = i % GRID;
          const active = mode === 'flash'
            ? (highlightRow ? r === tileRow : true) && (highlightCol ? c === tileCol : true)
              && ((highlightRow && r === tileRow) || (highlightCol && c === tileCol))
            : true;
          return (
            <div key={i} style={{
              width: TILE, height: TILE / 2, borderRadius: '4px', transition: 'all 0.3s',
              background: active ? color : 'rgba(229,223,211,0.4)',
              opacity: active ? 1 : 0.3,
            }} />
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Flash Attention Tiling Strategy</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['standard', 'flash'] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); reset(); }} style={{
            padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer',
            border: mode === m ? '2px solid #C76B4A' : '1px solid #E5DFD3',
            background: mode === m ? 'rgba(199,107,74,0.08)' : '#fff',
            color: mode === m ? '#C76B4A' : '#2C3E2D', fontWeight: mode === m ? 600 : 400,
          }}>{m === 'standard' ? 'Standard Attention' : 'Flash Attention'}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {renderMatrix('Q (Query)', 'rgba(199,107,74,0.6)', true, false)}
        {renderMatrix('K (Key)', 'rgba(139,168,136,0.6)', false, true)}
        {renderMatrix('V (Value)', 'rgba(212,168,67,0.6)', false, true)}

        <div style={{ flex: '1 1 120px', minWidth: '120px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>
            {mode === 'standard' ? 'Full N x N Attn Matrix' : 'Current Tile Output'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, ${TILE}px)`, gap: '2px' }}>
            {Array.from({ length: GRID * GRID }).map((_, i) => {
              const r = Math.floor(i / GRID), c = i % GRID;
              const processed = mode === 'standard' || (r < tileRow || (r === tileRow && c <= tileCol));
              const current = mode === 'flash' && r === tileRow && c === tileCol;
              return (
                <div key={i} style={{
                  width: TILE, height: TILE / 2, borderRadius: '4px', transition: 'all 0.3s',
                  background: current ? '#C76B4A' : processed ? '#8BA888' : 'rgba(229,223,211,0.4)',
                  opacity: processed || current ? 1 : 0.3,
                  border: current ? '2px solid #2C3E2D' : 'none',
                }} />
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(199,107,74,0.06)', borderRadius: '10px', padding: '0.75rem 1rem', flex: 1, minWidth: '140px' }}>
          <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Memory (Attn Matrix)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: mode === 'standard' ? '#C76B4A' : '#8BA888' }}>
            {mode === 'standard' ? `O(N\u00B2)` : `O(tile\u00B2)`}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2C3E2D' }}>
            {mode === 'standard' ? 'Full matrix materialized in HBM' : 'Only one tile in SRAM at a time'}
          </div>
        </div>
        <div style={{ background: 'rgba(139,168,136,0.06)', borderRadius: '10px', padding: '0.75rem 1rem', flex: 1, minWidth: '140px' }}>
          <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>I/O Reduction</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#D4A843' }}>
            {mode === 'standard' ? 'Baseline' : `${tilesProcessed}/${GRID * GRID} tiles`}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2C3E2D' }}>
            {mode === 'standard' ? 'Many HBM round-trips' : 'Fused kernel, fewer HBM reads'}
          </div>
        </div>
      </div>

      {mode === 'flash' && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={reset} style={{
            padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid #E5DFD3',
            background: '#fff', color: '#2C3E2D', cursor: 'pointer', fontSize: '0.8rem',
          }}>Reset</button>
          <button onClick={advance} disabled={done} style={{
            padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none',
            background: done ? '#E5DFD3' : '#C76B4A', color: '#fff', cursor: done ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem', fontWeight: 600,
          }}>{done ? 'Complete' : 'Process Next Tile'}</button>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: '#999' }}>
            Tile [{tileRow},{tileCol}]
          </span>
        </div>
      )}
    </div>
  );
}
