import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SLOTS = 4;
const TIME_STEPS = 12;

const requests = [
  { id: 'R1', len: 5, color: '#C76B4A' },
  { id: 'R2', len: 3, color: '#D4A843' },
  { id: 'R3', len: 7, color: '#8BA888' },
  { id: 'R4', len: 4, color: '#5B8DB8' },
  { id: 'R5', len: 2, color: '#9B7DB8' },
  { id: 'R6', len: 6, color: '#D48A9B' },
  { id: 'R7', len: 3, color: '#6BAAAA' },
  { id: 'R8', len: 4, color: '#B8965B' },
];

function buildTimeline(continuous: boolean) {
  const grid: (string | null)[][] = Array.from({ length: SLOTS }, () => Array(TIME_STEPS).fill(null));
  const queue = [...requests];
  const slotEnd = Array(SLOTS).fill(0);

  if (!continuous) {
    // Static: fill all slots, wait for longest, then refill
    let t = 0;
    while (t < TIME_STEPS && queue.length > 0) {
      const batch: typeof requests = [];
      for (let s = 0; s < SLOTS && queue.length > 0; s++) batch.push(queue.shift()!);
      const maxLen = Math.max(...batch.map(r => r.len));
      batch.forEach((r, s) => {
        for (let i = 0; i < r.len && t + i < TIME_STEPS; i++) grid[s][t + i] = r.id;
      });
      t += maxLen;
    }
  } else {
    // Continuous: fill slots as they free up
    for (let s = 0; s < SLOTS && queue.length > 0; s++) {
      const r = queue.shift()!;
      for (let i = 0; i < r.len && i < TIME_STEPS; i++) grid[s][i] = r.id;
      slotEnd[s] = r.len;
    }
    for (let t = 1; t < TIME_STEPS; t++) {
      for (let s = 0; s < SLOTS; s++) {
        if (slotEnd[s] === t && queue.length > 0) {
          const r = queue.shift()!;
          for (let i = 0; i < r.len && t + i < TIME_STEPS; i++) grid[s][t + i] = r.id;
          slotEnd[s] = t + r.len;
        }
      }
    }
  }
  let filled = 0, total = SLOTS * TIME_STEPS;
  grid.forEach(row => row.forEach(c => { if (c) filled++; }));
  return { grid, utilization: Math.round((filled / total) * 100) };
}

export default function ContinuousBatchingTimeline() {
  const [mode, setMode] = useState<'static' | 'continuous'>('static');
  const { grid, utilization } = buildTimeline(mode === 'continuous');
  const reqMap = Object.fromEntries(requests.map(r => [r.id, r]));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Continuous Batching Timeline
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare static batching (wait for all to finish) vs continuous batching (fill slots immediately).
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['static', 'continuous'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${mode === m ? '#C76B4A' : '#E5DFD3'}`,
            background: mode === m ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: mode === m ? '#C76B4A' : '#5A6B5C',
            fontWeight: mode === m ? 600 : 400, fontSize: '0.78rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", textTransform: 'capitalize',
          }}>
            {m} Batching
          </button>
        ))}
      </div>

      {/* Gantt chart */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem', paddingLeft: '50px' }}>
          {Array.from({ length: TIME_STEPS }, (_, i) => (
            <div key={i} style={{ width: '38px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#7A8B7C' }}>
              t{i}
            </div>
          ))}
        </div>
        {grid.map((row, s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.2rem' }}>
            <span style={{ width: '45px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#5A6B5C', textAlign: 'right', flexShrink: 0 }}>
              Slot {s}
            </span>
            {row.map((cell, t) => (
              <div key={t} style={{
                width: '38px', height: '24px', borderRadius: '3px',
                background: cell ? reqMap[cell]?.color || '#ccc' : 'rgba(229, 223, 211, 0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 600, color: cell ? '#fff' : 'transparent',
                fontFamily: "'JetBrains Mono', monospace", transition: 'background 0.2s',
              }}>
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Utilization meter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.3rem' }}>GPU Utilization</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.4rem', fontWeight: 700, color: utilization > 75 ? '#8BA888' : '#C76B4A' }}>
            {utilization}%
          </div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.3rem' }}>Mode</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 600, color: '#2C3E2D', textTransform: 'capitalize' }}>
            {mode}
          </div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        {mode === 'static'
          ? 'Static batching waits for the longest request to finish before starting a new batch. Short requests leave GPU slots idle, wasting compute.'
          : 'Continuous batching fills freed slots immediately with waiting requests. This eliminates idle bubbles and can nearly double GPU utilization.'}
      </div>
    </div>
  );
}
