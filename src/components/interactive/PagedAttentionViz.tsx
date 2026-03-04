import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const BLOCK_SIZE = 4;
const TOTAL_BLOCKS = 16;
const COLORS = ['#C76B4A', '#8BA888', '#D4A843', '#6E8B6B'];

interface Seq { id: number; name: string; tokens: number; blocks: number[]; }

export default function PagedAttentionViz() {
  const [sequences, setSequences] = useState<Seq[]>([
    { id: 0, name: 'Seq A', tokens: 8, blocks: [0, 1] },
    { id: 1, name: 'Seq B', tokens: 4, blocks: [2] },
    { id: 2, name: 'Seq C', tokens: 12, blocks: [3, 4, 5] },
  ]);
  const [showContiguous, setShowContiguous] = useState(false);

  const usedBlocks = new Set(sequences.flatMap((s) => s.blocks));
  const freeBlocks = Array.from({ length: TOTAL_BLOCKS }, (_, i) => i).filter((i) => !usedBlocks.has(i));

  const growSeq = (idx: number) => {
    if (freeBlocks.length === 0) return;
    setSequences((prev) => prev.map((s, i) => {
      if (i !== idx) return s;
      const newBlock = freeBlocks[0];
      return { ...s, tokens: s.tokens + BLOCK_SIZE, blocks: [...s.blocks, newBlock] };
    }));
  };

  const addSeq = () => {
    if (freeBlocks.length === 0) return;
    const id = sequences.length;
    setSequences([...sequences, { id, name: `Seq ${String.fromCharCode(65 + id)}`, tokens: BLOCK_SIZE, blocks: [freeBlocks[0]] }]);
  };

  const reset = () => setSequences([
    { id: 0, name: 'Seq A', tokens: 8, blocks: [0, 1] },
    { id: 1, name: 'Seq B', tokens: 4, blocks: [2] },
    { id: 2, name: 'Seq C', tokens: 12, blocks: [3, 4, 5] },
  ]);

  const blockOwner = (b: number): number => sequences.findIndex((s) => s.blocks.includes(b));
  const totalUsed = usedBlocks.size;
  const contiguousWaste = sequences.reduce((acc, s) => {
    const maxAlloc = Math.ceil(s.tokens / BLOCK_SIZE) + 1;
    return acc + (maxAlloc * BLOCK_SIZE - s.tokens);
  }, 0);
  const pagedWaste = sequences.reduce((acc, s) => acc + (s.blocks.length * BLOCK_SIZE - s.tokens), 0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>PagedAttention Virtual Memory</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setShowContiguous(false)} style={{
          padding: '0.35rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
          border: !showContiguous ? '2px solid #8BA888' : '1px solid #E5DFD3',
          background: !showContiguous ? 'rgba(139,168,136,0.08)' : '#fff', color: !showContiguous ? '#8BA888' : '#2C3E2D',
          fontWeight: !showContiguous ? 600 : 400,
        }}>Paged (PagedAttention)</button>
        <button onClick={() => setShowContiguous(true)} style={{
          padding: '0.35rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer',
          border: showContiguous ? '2px solid #C76B4A' : '1px solid #E5DFD3',
          background: showContiguous ? 'rgba(199,107,74,0.08)' : '#fff', color: showContiguous ? '#C76B4A' : '#2C3E2D',
          fontWeight: showContiguous ? 600 : 400,
        }}>Contiguous (Traditional)</button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.5rem' }}>Physical GPU Memory Blocks</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {Array.from({ length: TOTAL_BLOCKS }).map((_, b) => {
              const owner = blockOwner(b);
              const used = owner >= 0;
              return (
                <div key={b} style={{
                  height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, transition: 'all 0.3s',
                  background: used ? COLORS[owner % COLORS.length] : 'rgba(229,223,211,0.5)',
                  color: used ? '#fff' : '#bbb', border: used ? 'none' : '1px dashed #ccc',
                }}>{used ? sequences[owner]?.name?.slice(-1) : b}</div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.3rem' }}>
            {totalUsed}/{TOTAL_BLOCKS} blocks used ({freeBlocks.length} free)
          </div>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.5rem' }}>Page Table + Logical KV Cache</div>
          {sequences.map((seq, i) => (
            <div key={seq.id} style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2C3E2D' }}>{seq.name}</span>
                <span style={{ fontSize: '0.65rem', color: '#999', fontFamily: "'JetBrains Mono', monospace" }}>
                  {seq.tokens} tokens
                </span>
                <button onClick={() => growSeq(i)} disabled={freeBlocks.length === 0} style={{
                  marginLeft: 'auto', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem',
                  border: '1px solid #E5DFD3', background: '#fff', cursor: freeBlocks.length === 0 ? 'not-allowed' : 'pointer',
                  color: '#2C3E2D', opacity: freeBlocks.length === 0 ? 0.4 : 1,
                }}>+block</button>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {seq.blocks.map((b, j) => (
                  <div key={j} style={{
                    padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.6rem',
                    fontFamily: "'JetBrains Mono', monospace", background: 'rgba(229,223,211,0.4)', color: '#2C3E2D',
                  }}>[{j}] → B{b}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '130px', background: showContiguous ? 'rgba(199,107,74,0.06)' : 'rgba(139,168,136,0.06)', borderRadius: '10px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' as const }}>Memory Waste</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: showContiguous ? '#C76B4A' : '#8BA888' }}>
            {showContiguous ? `${contiguousWaste} tokens` : `${pagedWaste} tokens`}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#2C3E2D' }}>
            {showContiguous ? 'Pre-allocated padding' : 'Only last-block padding'}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '130px', background: 'rgba(212,168,67,0.06)', borderRadius: '10px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' as const }}>Fragmentation</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#D4A843' }}>
            {showContiguous ? 'High' : 'Near-zero'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#2C3E2D' }}>
            {showContiguous ? 'Gaps between allocations' : 'Non-contiguous is fine'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={reset} style={{
          padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid #E5DFD3',
          background: '#fff', color: '#2C3E2D', cursor: 'pointer', fontSize: '0.8rem',
        }}>Reset</button>
        <button onClick={addSeq} disabled={freeBlocks.length === 0 || sequences.length >= 4} style={{
          padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none',
          background: freeBlocks.length === 0 || sequences.length >= 4 ? '#E5DFD3' : '#C76B4A',
          color: '#fff', cursor: freeBlocks.length === 0 || sequences.length >= 4 ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem', fontWeight: 600,
        }}>Add Sequence</button>
      </div>
    </div>
  );
}
