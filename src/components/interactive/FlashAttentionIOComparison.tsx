import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SEQ_LENGTHS = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];
const SRAM_SIZE = 192 * 1024;

function standardIO(n: number): number { return 2 * n * n + 3 * n * 128; }
function flashIO(n: number): number { return 2 * n * n * 128 / SRAM_SIZE + 3 * n * 128; }

export default function FlashAttentionIOComparison() {
  const [seqIdx, setSeqIdx] = useState(3);
  const seqLen = SEQ_LENGTHS[seqIdx];

  const stdIO = standardIO(seqLen);
  const fIO = flashIO(seqLen);
  const speedup = stdIO / fIO;
  const maxIO = standardIO(SEQ_LENGTHS[SEQ_LENGTHS.length - 1]);

  const barData = SEQ_LENGTHS.map((n) => ({
    n,
    standard: standardIO(n),
    flash: flashIO(n),
  }));

  const formatBytes = (b: number) => {
    if (b >= 1e12) return `${(b / 1e12).toFixed(1)}T`;
    if (b >= 1e9) return `${(b / 1e9).toFixed(1)}G`;
    if (b >= 1e6) return `${(b / 1e6).toFixed(1)}M`;
    if (b >= 1e3) return `${(b / 1e3).toFixed(0)}K`;
    return `${b}`;
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Flash Attention I/O Complexity Comparison</h3>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
          <span style={{ color: '#2C3E2D' }}>Sequence Length</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{seqLen.toLocaleString()} tokens</span>
        </div>
        <input type="range" min={0} max={SEQ_LENGTHS.length - 1} value={seqIdx} onChange={(e) => setSeqIdx(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#999' }}>
          <span>512</span><span>65K</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', fontWeight: 600 }}>HBM Reads + Writes (bytes transferred)</div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '140px' }}>
          {barData.map((d, i) => {
            const selected = i === seqIdx;
            const maxH = 130;
            const stdH = Math.max(2, (d.standard / maxIO) * maxH);
            const flashH = Math.max(2, (d.flash / maxIO) * maxH);
            return (
              <div key={d.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                onClick={() => setSeqIdx(i)}>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: maxH }}>
                  <div style={{
                    width: '100%', height: `${stdH}px`, borderRadius: '4px 4px 0 0',
                    background: selected ? '#C76B4A' : 'rgba(199,107,74,0.3)', transition: 'all 0.3s', minWidth: '8px',
                  }} />
                  <div style={{
                    width: '100%', height: `${flashH}px`, borderRadius: '4px 4px 0 0',
                    background: selected ? '#8BA888' : 'rgba(139,168,136,0.3)', transition: 'all 0.3s', minWidth: '8px',
                  }} />
                </div>
                <div style={{
                  fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace",
                  color: selected ? '#2C3E2D' : '#999', fontWeight: selected ? 700 : 400,
                }}>{d.n >= 1024 ? `${d.n / 1024}K` : d.n}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#C76B4A' }} />
            <span style={{ color: '#2C3E2D' }}>Standard O(N²)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: '#8BA888' }} />
            <span style={{ color: '#2C3E2D' }}>Flash O(N²/M)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Standard I/O', value: formatBytes(stdIO), sub: 'O(N² + Nd)', color: '#C76B4A' },
          { label: 'Flash I/O', value: formatBytes(fIO), sub: 'O(N²d/M + Nd)', color: '#8BA888' },
          { label: 'Speedup Factor', value: `${speedup.toFixed(1)}x`, sub: `SRAM=${(SRAM_SIZE / 1024)}KB`, color: '#D4A843' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: '100px', background: 'rgba(229,223,211,0.2)', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{item.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#999', fontFamily: "'JetBrains Mono', monospace" }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        At <strong>{seqLen.toLocaleString()} tokens</strong>, Flash Attention reduces HBM I/O by <strong>{speedup.toFixed(1)}x</strong>.
        The gap widens with longer sequences because standard attention materializes the full N x N matrix in HBM,
        while Flash Attention keeps tiles in fast SRAM, reducing memory traffic by a factor of M (SRAM size).
      </div>
    </div>
  );
}
