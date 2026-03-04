import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const queries = [
  { text: 'What is 2+2?', complexity: 'simple', routed: 'Small (8B)', cost: 0.01, quality: 99 },
  { text: 'Summarize this paragraph', complexity: 'simple', routed: 'Small (8B)', cost: 0.01, quality: 95 },
  { text: 'Write a Python sort function', complexity: 'medium', routed: 'Medium (32B)', cost: 0.08, quality: 94 },
  { text: 'Explain quantum entanglement', complexity: 'medium', routed: 'Medium (32B)', cost: 0.08, quality: 92 },
  { text: 'Debug this concurrent Rust code', complexity: 'complex', routed: 'Large (70B)', cost: 0.30, quality: 97 },
  { text: 'Prove this theorem formally', complexity: 'complex', routed: 'Large (70B)', cost: 0.30, quality: 98 },
];

const modelTiers = [
  { name: 'Small (8B)', cost: '$', color: '#8BA888', icon: '⚡' },
  { name: 'Medium (32B)', cost: '$$', color: '#D4A843', icon: '⚙️' },
  { name: 'Large (70B)', cost: '$$$', color: '#C76B4A', icon: '🔬' },
];

export default function ModelRoutingViz() {
  const [selectedQuery, setSelectedQuery] = useState(0);
  const [showRouter, setShowRouter] = useState(true);

  const q = queries[selectedQuery];
  const allLargeCost = queries.reduce((s, _) => s + 0.30, 0);
  const routedCost = queries.reduce((s, q) => s + q.cost, 0);
  const savings = Math.round((1 - routedCost / allLargeCost) * 100);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LLM Model Routing
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          A router classifier directs each query to the most cost-effective model that can handle it.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button onClick={() => setShowRouter(true)} style={{
          padding: '0.35rem 0.75rem', borderRadius: '6px',
          border: `1px solid ${showRouter ? '#C76B4A' : '#E5DFD3'}`,
          background: showRouter ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
          color: showRouter ? '#C76B4A' : '#5A6B5C', fontWeight: showRouter ? 600 : 400,
          fontSize: '0.78rem', cursor: 'pointer',
        }}>With Routing</button>
        <button onClick={() => setShowRouter(false)} style={{
          padding: '0.35rem 0.75rem', borderRadius: '6px',
          border: `1px solid ${!showRouter ? '#C76B4A' : '#E5DFD3'}`,
          background: !showRouter ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
          color: !showRouter ? '#C76B4A' : '#5A6B5C', fontWeight: !showRouter ? 600 : 400,
          fontSize: '0.78rem', cursor: 'pointer',
        }}>All Large Model</button>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Incoming Queries — click to inspect routing
        </div>
        <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem' }}>
          {queries.map((query, i) => {
            const tierColor = query.complexity === 'simple' ? '#8BA888' : query.complexity === 'medium' ? '#D4A843' : '#C76B4A';
            return (
              <div key={i} onClick={() => setSelectedQuery(i)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.55rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
                background: selectedQuery === i ? '#FDFBF7' : 'transparent',
                border: selectedQuery === i ? `1px solid ${tierColor}40` : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.6rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                    background: `${tierColor}20`, color: tierColor, fontWeight: 600, textTransform: 'uppercase',
                  }}>{query.complexity}</span>
                  <span style={{ fontSize: '0.8rem', color: '#2C3E2D' }}>{query.text}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: tierColor, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  → {showRouter ? query.routed : 'Large (70B)'}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {modelTiers.map(m => {
            const count = showRouter ? queries.filter(q => q.routed === m.name).length : (m.name === 'Large (70B)' ? queries.length : 0);
            return (
              <div key={m.name} style={{
                textAlign: 'center', padding: '0.6rem 1rem', borderRadius: '8px',
                background: count > 0 ? `${m.color}15` : 'transparent',
                border: `1px solid ${count > 0 ? `${m.color}30` : '#E5DFD3'}`,
                opacity: count > 0 ? 1 : 0.4,
              }}>
                <div style={{ fontSize: '1.1rem' }}>{m.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: m.color }}>{m.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#7A8B7C' }}>{count} queries • {m.cost}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Total Cost</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#2C3E2D' }}>
            ${showRouter ? routedCost.toFixed(2) : allLargeCost.toFixed(2)}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Savings</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: showRouter ? '#8BA888' : '#B5AFA3' }}>
            {showRouter ? `${savings}%` : '0%'}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Avg Quality</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#D4A843' }}>
            {showRouter ? Math.round(queries.reduce((s, q) => s + q.quality, 0) / queries.length) : 98}%
          </div>
        </div>
      </div>
    </div>
  );
}
