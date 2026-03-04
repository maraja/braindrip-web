import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

interface Request { id: string; arrive: number; duration: number; color: string; }

const COLORS = ['#C76B4A', '#8BA888', '#D4A843', '#6E8B6B', '#9B7FB8', '#5C8A97'];
const REQUESTS: Request[] = [
  { id: 'A', arrive: 0, duration: 5, color: COLORS[0] },
  { id: 'B', arrive: 1, duration: 3, color: COLORS[1] },
  { id: 'C', arrive: 2, duration: 7, color: COLORS[2] },
  { id: 'D', arrive: 4, duration: 2, color: COLORS[3] },
  { id: 'E', arrive: 6, duration: 4, color: COLORS[4] },
  { id: 'F', arrive: 8, duration: 3, color: COLORS[5] },
];

const MAX_BATCH = 3;
const TIMELINE = 22;

function computeStatic(reqs: Request[]): { slots: { req: Request; start: number; end: number }[][] } {
  const slots: { req: Request; start: number; end: number }[][] = [];
  let batchStart = 0;
  let queue = [...reqs];
  while (queue.length > 0) {
    const batch = queue.filter((r) => r.arrive <= batchStart).slice(0, MAX_BATCH);
    if (batch.length === 0) { batchStart = queue[0].arrive; continue; }
    const batchEnd = batchStart + Math.max(...batch.map((r) => r.duration));
    slots.push(batch.map((r) => ({ req: r, start: batchStart, end: batchEnd })));
    queue = queue.filter((r) => !batch.includes(r));
    batchStart = batchEnd;
  }
  return { slots };
}

function computeContinuous(reqs: Request[]): { slots: { req: Request; start: number; end: number }[] } {
  const slots: { req: Request; start: number; end: number }[] = [];
  const active: { req: Request; end: number }[] = [];
  const queue = [...reqs];
  for (let t = 0; t < TIMELINE; t++) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= t) active.splice(i, 1);
    }
    while (active.length < MAX_BATCH && queue.length > 0 && queue[0].arrive <= t) {
      const r = queue.shift()!;
      const start = t;
      const end = t + r.duration;
      active.push({ req: r, end });
      slots.push({ req: r, start, end });
    }
  }
  return { slots };
}

export default function ContinuousBatchingViz() {
  const [mode, setMode] = useState<'static' | 'continuous'>('continuous');
  const [step, setStep] = useState(TIMELINE);

  const staticResult = computeStatic(REQUESTS);
  const contResult = computeContinuous(REQUESTS);

  const staticSlots = staticResult.slots.flat();
  const staticEnd = Math.max(...staticSlots.map((s) => s.end));
  const contEnd = Math.max(...contResult.slots.map((s) => s.end));

  const staticThroughput = REQUESTS.length / staticEnd;
  const contThroughput = REQUESTS.length / contEnd;
  const improvement = ((contThroughput - staticThroughput) / staticThroughput * 100);

  const activeSlots = mode === 'static' ? staticSlots : contResult.slots;
  const cellW = `${100 / TIMELINE}%`;

  const renderTimeline = (label: string, slots: { req: Request; start: number; end: number }[], totalEnd: number) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.4rem' }}>{label}</div>
      {Array.from({ length: MAX_BATCH }).map((_, slotIdx) => {
        const slotItems = slots.filter((_, i) => {
          if (mode === 'static') {
            const batchIdx = staticResult.slots.findIndex((batch) => batch.includes(slots[i]));
            return batchIdx >= 0 && staticResult.slots[batchIdx].indexOf(slots[i]) === slotIdx;
          }
          return false;
        });
        return (
          <div key={slotIdx} style={{ display: 'flex', height: '28px', marginBottom: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(229,223,211,0.3)', borderRadius: '4px' }} />
            {slots.map((s, i) => {
              if (s.start >= step) return null;
              const visEnd = Math.min(s.end, step);
              return (
                <div key={i} style={{
                  position: 'absolute', left: `${(s.start / TIMELINE) * 100}%`,
                  width: `${((visEnd - s.start) / TIMELINE) * 100}%`, height: '100%',
                  background: s.req.color, borderRadius: '4px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace", transition: 'width 0.3s', opacity: 0.85,
                }}>{s.req.id}</div>
              );
            })}
          </div>
        );
      })}
      <div style={{ display: 'flex', marginTop: '2px' }}>
        {Array.from({ length: TIMELINE }).map((_, t) => (
          <div key={t} style={{
            width: cellW, fontSize: '0.5rem', textAlign: 'center' as const,
            fontFamily: "'JetBrains Mono', monospace", color: t === step ? '#C76B4A' : '#bbb',
            fontWeight: t === step ? 700 : 400,
          }}>{t}</div>
        ))}
      </div>
    </div>
  );

  const renderContinuousTimeline = (label: string, slots: { req: Request; start: number; end: number }[]) => {
    const rows: { req: Request; start: number; end: number }[][] = [[], [], []];
    slots.forEach((s) => {
      for (let r = 0; r < MAX_BATCH; r++) {
        if (rows[r].every((existing) => existing.end <= s.start || existing.start >= s.end)) {
          rows[r].push(s); return;
        }
      }
    });

    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.4rem' }}>{label}</div>
        {rows.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', height: '28px', marginBottom: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(229,223,211,0.3)', borderRadius: '4px' }} />
            {row.map((s, i) => {
              if (s.start >= step) return null;
              const visEnd = Math.min(s.end, step);
              return (
                <div key={i} style={{
                  position: 'absolute', left: `${(s.start / TIMELINE) * 100}%`,
                  width: `${((visEnd - s.start) / TIMELINE) * 100}%`, height: '100%',
                  background: s.req.color, borderRadius: '4px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace", transition: 'width 0.3s', opacity: 0.85,
                }}>{s.req.id}</div>
              );
            })}
          </div>
        ))}
        <div style={{ display: 'flex', marginTop: '2px' }}>
          {Array.from({ length: TIMELINE }).map((_, t) => (
            <div key={t} style={{
              width: cellW, fontSize: '0.5rem', textAlign: 'center' as const,
              fontFamily: "'JetBrains Mono', monospace", color: '#bbb',
            }}>{t}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Continuous vs Static Batching</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {REQUESTS.map((r) => (
          <div key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem',
            borderRadius: '6px', background: 'rgba(229,223,211,0.3)', fontSize: '0.7rem',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{r.id}</span>
            <span style={{ color: '#999' }}>t={r.arrive}, len={r.duration}</span>
          </div>
        ))}
      </div>

      {renderTimeline('Static Batching (wait for all to finish)', staticSlots, staticEnd)}
      {renderContinuousTimeline('Continuous Batching (in-flight insertion)', contResult.slots)}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Static Throughput', value: `${staticThroughput.toFixed(2)} req/t`, color: '#C76B4A' },
          { label: 'Continuous Throughput', value: `${contThroughput.toFixed(2)} req/t`, color: '#8BA888' },
          { label: 'Improvement', value: `+${improvement.toFixed(0)}%`, color: '#D4A843' },
          { label: 'Batch Slots', value: `${MAX_BATCH}`, color: '#2C3E2D' },
        ].map((item) => (
          <div key={item.label} style={{ flex: 1, minWidth: '90px', background: 'rgba(229,223,211,0.2)', borderRadius: '10px', padding: '0.6rem' }}>
            <div style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{item.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        <strong>Static batching</strong> waits for the longest request in each batch to finish before starting new work, leaving GPU idle.
        <strong> Continuous batching</strong> fills freed slots immediately with waiting requests,
        improving throughput by <strong style={{ color: '#D4A843' }}>{improvement.toFixed(0)}%</strong> in this scenario.
      </div>
    </div>
  );
}
