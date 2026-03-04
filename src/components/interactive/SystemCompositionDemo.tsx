import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const components = [
  { id: 'llm', name: 'LLM Generator', icon: '🧠', cost: 3, latency: 2, quality: 7 },
  { id: 'retriever', name: 'Retriever', icon: '🔍', cost: 1, latency: 1, quality: 0 },
  { id: 'code', name: 'Code Executor', icon: '💻', cost: 1, latency: 2, quality: 3 },
  { id: 'judge', name: 'LLM Judge', icon: '⚖️', cost: 3, latency: 2, quality: 4 },
  { id: 'guard', name: 'Guardrails', icon: '🛡️', cost: 1, latency: 1, quality: 1 },
];

export default function SystemCompositionDemo() {
  const [selected, setSelected] = useState<string[]>(['llm', 'retriever']);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedComps = components.filter(c => selected.includes(c.id));
  const totalCost = selectedComps.reduce((s, c) => s + c.cost, 0);
  const totalLatency = selectedComps.reduce((s, c) => s + c.latency, 0);
  const totalQuality = Math.min(10, selectedComps.reduce((s, c) => s + c.quality, 0));

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>System Composition Builder</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Pick components and see how they affect cost, latency, and quality.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
        {components.map(c => {
          const isSelected = selected.includes(c.id);
          return (
            <div key={c.id} onClick={() => toggle(c.id)} style={{
              padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${isSelected ? '#C76B4A' : '#E5DFD3'}`,
              background: isSelected ? 'rgba(199,107,74,0.06)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: `2px solid ${isSelected ? '#C76B4A' : '#D4C5A9'}`, background: isSelected ? '#C76B4A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: '#fff' }}>
                {isSelected ? '✓' : ''}
              </div>
              <span style={{ fontSize: '0.9rem' }}>{c.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: isSelected ? 600 : 400, color: '#2C3E2D', flex: 1 }}>{c.name}</span>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6rem', color: '#7A8B7C' }}>
                <span>Cost:{c.cost}</span>
                <span>Lat:{c.latency}</span>
                <span>Qual:{c.quality}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedComps.length > 0 && (
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.3rem' }}>Pipeline</div>
          <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {selectedComps.map((c, i) => (
              <span key={c.id}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#C76B4A' }}>{c.icon} {c.name}</span>
                {i < selectedComps.length - 1 && <span style={{ color: '#D4C5A9', margin: '0 0.2rem' }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { label: 'Total Cost', value: totalCost, max: 12, color: totalCost > 8 ? '#C76B4A' : '#D4A843', unit: '/10' },
          { label: 'Latency', value: totalLatency, max: 10, color: totalLatency > 6 ? '#C76B4A' : '#D4A843', unit: '/10' },
          { label: 'Quality', value: totalQuality, max: 10, color: totalQuality > 7 ? '#8BA888' : '#D4A843', unit: '/10' },
        ].map(item => (
          <div key={item.label} style={{ padding: '0.5rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.55rem', color: '#7A8B7C', textTransform: 'uppercase' as const, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: item.color }}>{item.value}{item.unit}</div>
            <div style={{ background: '#E5DFD3', borderRadius: '3px', height: '6px', marginTop: '0.25rem', overflow: 'hidden' }}>
              <div style={{ width: `${(item.value / item.max) * 100}%`, height: '100%', background: item.color, borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
