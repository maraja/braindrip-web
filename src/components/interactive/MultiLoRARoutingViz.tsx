import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const ADAPTERS = [
  { name: 'Code', color: '#C76B4A', icon: '{/}' },
  { name: 'Medical', color: '#8BA888', icon: '+' },
  { name: 'Legal', color: '#D4A843', icon: '§' },
  { name: 'Finance', color: '#6E8B6B', icon: '$' },
  { name: 'Creative', color: '#9B7EC8', icon: '*' },
  { name: 'Science', color: '#5A9EC7', icon: '~' },
  { name: 'Customer', color: '#C7855A', icon: '@' },
  { name: 'Translate', color: '#8B8BA8', icon: 'A' },
];

export default function MultiLoRARoutingViz() {
  const [adapterCount, setAdapterCount] = useState(4);
  const [gpuSlots, setGpuSlots] = useState(3);
  const [activeRequests, setActiveRequests] = useState<number[]>([0, 1, 2]);

  const activeAdapters = ADAPTERS.slice(0, adapterCount);
  const onGPU = activeAdapters.slice(0, gpuSlots);
  const inPool = activeAdapters.slice(gpuSlots);

  const throughputBase = 100;
  const throughput = Math.round(throughputBase * (gpuSlots / adapterCount) * (1 + Math.log2(gpuSlots)));
  const swapRate = Math.max(0, adapterCount - gpuSlots);
  const avgLatency = (2.5 + swapRate * 1.2).toFixed(1);

  const toggleRequest = (idx: number) => {
    setActiveRequests(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx].slice(-gpuSlots)
    );
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Multi-LoRA Serving Architecture
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>
            Total adapters: <strong style={{ color: '#C76B4A' }}>{adapterCount}</strong>
          </label>
          <input type="range" min={2} max={8} value={adapterCount} onChange={e => {
            const v = +e.target.value;
            setAdapterCount(v);
            if (gpuSlots > v) setGpuSlots(v);
            setActiveRequests(prev => prev.filter(i => i < v).slice(0, Math.min(gpuSlots, v)));
          }} style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>
            GPU slots: <strong style={{ color: '#8BA888' }}>{gpuSlots}</strong>
          </label>
          <input type="range" min={1} max={Math.min(adapterCount, 6)} value={gpuSlots}
            onChange={e => setGpuSlots(+e.target.value)} style={{ width: '100%', accentColor: '#8BA888' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '0.5rem', alignItems: 'start', marginBottom: '1.25rem' }}>
        {/* Requests */}
        <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5A6B5C', marginBottom: '0.5rem', textAlign: 'center' as const }}>Requests</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.3rem' }}>
            {activeAdapters.map((a, i) => (
              <button key={i} onClick={() => toggleRequest(i)} style={{
                padding: '0.3rem 0.5rem', borderRadius: '6px', border: `1.5px solid ${a.color}`,
                background: activeRequests.includes(i) ? `${a.color}18` : 'transparent',
                cursor: 'pointer', fontSize: '0.7rem', color: a.color, fontWeight: 500,
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
                opacity: activeRequests.includes(i) ? 1 : 0.5,
              }}>
                {a.icon} {a.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2rem', color: '#E5DFD3', fontSize: '1.2rem' }}>&#8594;</div>

        {/* Base Model + GPU */}
        <div style={{ background: 'rgba(139,168,136,0.06)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(139,168,136,0.2)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.5rem', textAlign: 'center' as const }}>GPU Memory</div>
          <div style={{ background: 'rgba(44,62,45,0.08)', borderRadius: '6px', padding: '0.5rem', marginBottom: '0.5rem', textAlign: 'center' as const }}>
            <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>Base Model</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#2C3E2D', fontWeight: 600 }}>Frozen</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.25rem' }}>
            {onGPU.map((a, i) => (
              <div key={i} style={{
                padding: '0.25rem 0.5rem', borderRadius: '4px', background: `${a.color}20`,
                border: `1px solid ${a.color}40`, fontSize: '0.65rem', color: a.color,
                fontWeight: 600, display: 'flex', justifyContent: 'space-between',
              }}>
                <span>{a.icon} {a.name}</span>
                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>loaded</span>
              </div>
            ))}
            {Array.from({ length: Math.max(0, gpuSlots - onGPU.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(44,62,45,0.04)', border: '1px dashed #E5DFD3', fontSize: '0.65rem', color: '#999' }}>
                empty slot
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2rem', color: '#E5DFD3', fontSize: '1rem' }}>&#8596;</div>

        {/* Adapter Pool */}
        <div style={{ background: 'rgba(212,168,67,0.04)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(212,168,67,0.15)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.5rem', textAlign: 'center' as const }}>Adapter Pool (CPU/Disk)</div>
          {inPool.length > 0 ? inPool.map((a, i) => (
            <div key={i} style={{
              padding: '0.25rem 0.5rem', borderRadius: '4px', background: `${a.color}10`,
              border: `1px dashed ${a.color}40`, fontSize: '0.65rem', color: a.color,
              marginBottom: '0.25rem', opacity: 0.7,
            }}>
              {a.icon} {a.name}
            </div>
          )) : (
            <div style={{ fontSize: '0.65rem', color: '#999', textAlign: 'center' as const, padding: '0.5rem' }}>All loaded on GPU</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>Throughput</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#2C3E2D', fontWeight: 600 }}>{throughput}</div>
          <div style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>req/min</div>
        </div>
        <div style={{ background: 'rgba(212,168,67,0.08)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>Swap rate</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: swapRate > 0 ? '#D4A843' : '#8BA888', fontWeight: 600 }}>{swapRate}</div>
          <div style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>adapters/batch</div>
        </div>
        <div style={{ background: 'rgba(199,107,74,0.08)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.65rem', color: '#5A6B5C' }}>Avg latency</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#C76B4A', fontWeight: 600 }}>{avgLatency}</div>
          <div style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>ms overhead</div>
        </div>
      </div>
    </div>
  );
}
