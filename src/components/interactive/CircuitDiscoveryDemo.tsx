import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const circuits = [
  { name: 'Induction Head', task: 'Copy patterns: [A][B]...[A] → [B]', layers: [
    { label: 'L0: Previous Token', neurons: 3, role: 'Attends to previous position' },
    { label: 'L1: Induction', neurons: 4, role: 'Finds matching prefix, copies next token' },
  ], desc: 'Enables in-context learning by detecting and continuing repeated patterns.' },
  { name: 'IOI Circuit', task: 'Indirect Object: "Mary gave to John" → John', layers: [
    { label: 'L0: Name Movers', neurons: 5, role: 'Identify and move name tokens' },
    { label: 'L1: S-Inhibition', neurons: 3, role: 'Suppress the subject name (Mary)' },
    { label: 'L2: Name Output', neurons: 2, role: 'Boost the indirect object (John)' },
  ], desc: 'A 26-head circuit for identifying indirect objects in sentences.' },
  { name: 'Greater-Than', task: 'Compare: "is 47 greater than 31?" → Yes', layers: [
    { label: 'L0: Number Embed', neurons: 4, role: 'Encode numerical magnitudes' },
    { label: 'L1: Comparison', neurons: 3, role: 'Compare magnitude representations' },
    { label: 'L2: Output', neurons: 2, role: 'Map comparison result to Yes/No' },
  ], desc: 'A circuit that performs numerical comparison via learned magnitude representations.' },
];

export default function CircuitDiscoveryDemo() {
  const [circIdx, setCircIdx] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const circ = circuits[circIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Circuit Discovery</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore discovered circuits — groups of neurons that collaborate for specific tasks.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {circuits.map((c, i) => (
          <button key={c.name} onClick={() => { setCircIdx(i); setActiveLayer(0); }} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px', border: `1px solid ${circIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: circIdx === i ? 'rgba(199,107,74,0.08)' : 'transparent', color: circIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: circIdx === i ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
          }}>{c.name}</button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2C3E2D' }}>
        Task: {circ.task}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {circ.layers.map((layer, i) => (
          <div key={i} onClick={() => setActiveLayer(i)} style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
            border: `1px solid ${activeLayer === i ? '#8BA888' : '#E5DFD3'}`,
            background: activeLayer === i ? 'rgba(139,168,136,0.06)' : 'transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2C3E2D' }}>{layer.label}</span>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {Array.from({ length: layer.neurons }).map((_, n) => (
                  <div key={n} style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeLayer === i ? '#8BA888' : '#D4C5A9', transition: 'background 0.2s' }} />
                ))}
              </div>
            </div>
            {activeLayer === i && <div style={{ fontSize: '0.75rem', color: '#5A6B5C', marginTop: '0.3rem' }}>{layer.role}</div>}
          </div>
        ))}
      </div>

      {activeLayer < circ.layers.length - 1 && (
        <div style={{ textAlign: 'center', color: '#8BA888', fontSize: '0.8rem', margin: '-0.2rem 0' }}>↓ information flows ↓</div>
      )}

      <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: 'rgba(212,168,67,0.08)', borderRadius: '6px', fontSize: '0.78rem', color: '#5A6B5C' }}>
        {circ.desc}
      </div>
    </div>
  );
}
