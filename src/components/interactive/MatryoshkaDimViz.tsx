import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const dimensions = [
  { dim: 1536, quality: 100, storage: '100%', speed: '1x', label: 'Full', color: '#C76B4A' },
  { dim: 768, quality: 98, storage: '50%', speed: '2x', label: '1/2', color: '#D4A843' },
  { dim: 384, quality: 95, storage: '25%', speed: '4x', label: '1/4', color: '#8BA888' },
  { dim: 192, quality: 90, storage: '12.5%', speed: '8x', label: '1/8', color: '#6E8B6B' },
  { dim: 96, quality: 82, storage: '6.25%', speed: '16x', label: '1/16', color: '#5A6B5C' },
];

export default function MatryoshkaDimViz() {
  const [dimIdx, setDimIdx] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Matryoshka Embeddings</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Nested embeddings: truncate to any dimension while retaining quality.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', gap: '0.1rem' }}>
        {dimensions.map((d, i) => {
          const size = 30 + (dimensions.length - i) * 20;
          return (
            <div key={d.dim} onClick={() => setDimIdx(i)} style={{
              width: `${size}px`, height: `${size}px`, borderRadius: '50%',
              border: `2px solid ${dimIdx === i ? d.color : '#E5DFD3'}`,
              background: dimIdx === i ? d.color + '20' : '#FDFBF7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', marginLeft: i > 0 ? `-${size * 0.3}px` : '0',
              zIndex: dimensions.length - i,
            }}>
              <span style={{ fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace", color: dimIdx === i ? d.color : '#7A8B7C', fontWeight: dimIdx === i ? 700 : 400 }}>{d.dim}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ fontSize: '0.72rem', color: '#5A6B5C', fontWeight: 600 }}>Truncation level: {dimensions[dimIdx].dim} dims ({dimensions[dimIdx].label})</label>
        <input type="range" min={0} max={dimensions.length - 1} value={dimIdx} onChange={e => setDimIdx(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Quality', value: `${dimensions[dimIdx].quality}%`, color: dimensions[dimIdx].quality > 90 ? '#8BA888' : '#D4A843' },
          { label: 'Storage', value: dimensions[dimIdx].storage, color: '#C76B4A' },
          { label: 'Search Speed', value: dimensions[dimIdx].speed, color: '#8BA888' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '0.95rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
        <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.2rem' }}>Quality retained at each level</div>
        <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'flex-end', height: '40px' }}>
          {dimensions.map((d, i) => (
            <div key={d.dim} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: `${d.quality * 0.4}px`, background: dimIdx === i ? d.color : '#D4C5A9', borderRadius: '3px 3px 0 0', opacity: dimIdx === i ? 1 : 0.4, transition: 'all 0.2s' }} />
              <span style={{ fontSize: '0.5rem', color: '#7A8B7C', marginTop: '0.1rem' }}>{d.dim}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
