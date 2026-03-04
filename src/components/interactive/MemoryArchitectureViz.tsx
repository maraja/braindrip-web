import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

interface MemoryItem {
  text: string;
  age: string;
  relevance: number;
}

const memoryTiers = [
  {
    id: 'working',
    name: 'Working Memory',
    subtitle: 'Context Window',
    color: '#C76B4A',
    icon: '⚡',
    capacity: '128K tokens',
    persistence: 'Current session only',
    speed: 'Instant',
    desc: 'The active context window. Everything the model can directly attend to. Lost when the session ends.',
    items: [
      { text: 'Current user message about travel planning', age: 'Now', relevance: 1.0 },
      { text: 'System prompt with agent instructions', age: 'Session start', relevance: 0.9 },
      { text: 'Previous 3 turns of conversation', age: '2 min ago', relevance: 0.7 },
    ],
  },
  {
    id: 'short',
    name: 'Short-Term Memory',
    subtitle: 'Recent Interactions',
    color: '#D4A843',
    icon: '📋',
    capacity: 'Last ~50 interactions',
    persistence: 'Hours to days',
    speed: 'Fast retrieval',
    desc: 'Recent conversation summaries and key facts. Stored as structured data, retrieved by recency and relevance.',
    items: [
      { text: 'User prefers budget travel options', age: '1 hour ago', relevance: 0.85 },
      { text: 'User mentioned traveling to Japan in April', age: '30 min ago', relevance: 0.92 },
      { text: 'Previous search: "best ryokans in Kyoto"', age: '20 min ago', relevance: 0.78 },
      { text: 'User allergic to shellfish (dietary note)', age: '2 hours ago', relevance: 0.65 },
    ],
  },
  {
    id: 'long',
    name: 'Long-Term Memory',
    subtitle: 'Vector Store / Knowledge Base',
    color: '#8BA888',
    icon: '🗄️',
    capacity: 'Unlimited',
    persistence: 'Persistent',
    speed: 'Semantic search',
    desc: 'Embeddings stored in a vector database. Supports semantic search for relevant past interactions and knowledge.',
    items: [
      { text: 'User profile: frequent traveler, photographer', age: '3 months ago', relevance: 0.72 },
      { text: 'Past trip: visited Thailand, loved Chiang Mai', age: '6 months ago', relevance: 0.58 },
      { text: 'Preferred airlines: ANA, JAL for Asia routes', age: '1 month ago', relevance: 0.68 },
      { text: 'Travel style: cultural immersion, local food', age: '4 months ago', relevance: 0.61 },
      { text: 'Budget range: $2000-3000 per trip', age: '2 months ago', relevance: 0.75 },
    ],
  },
];

export default function MemoryArchitectureViz() {
  const [selectedTier, setSelectedTier] = useState('working');
  const [showFlow, setShowFlow] = useState(false);

  const tier = memoryTiers.find(t => t.id === selectedTier)!;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Memory Architecture
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore the three tiers of agent memory: working, short-term, and long-term. See how information flows between them.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {memoryTiers.map(t => (
          <button key={t.id} onClick={() => setSelectedTier(t.id)} style={{
            padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
            border: `2px solid ${selectedTier === t.id ? t.color : '#E5DFD3'}`,
            background: selectedTier === t.id ? t.color + '10' : 'transparent',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{t.icon}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: t.color }}>{t.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>{t.subtitle}</div>
          </button>
        ))}
      </div>

      {showFlow && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', background: '#F0EBE1', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#C76B4A', fontWeight: 600 }}>Working</span>
          <span style={{ color: '#B0A898' }}>← summarize →</span>
          <span style={{ fontSize: '0.72rem', color: '#D4A843', fontWeight: 600 }}>Short-Term</span>
          <span style={{ color: '#B0A898' }}>← embed →</span>
          <span style={{ fontSize: '0.72rem', color: '#8BA888', fontWeight: 600 }}>Long-Term</span>
        </div>
      )}

      <div style={{ background: tier.color + '08', border: `1px solid ${tier.color}33`, borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.82rem', color: '#5A6B5C', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>{tier.desc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {[
            { label: 'Capacity', value: tier.capacity },
            { label: 'Persistence', value: tier.persistence },
            { label: 'Access Speed', value: tier.speed },
          ].map(m => (
            <div key={m.label} style={{ padding: '0.4rem', background: '#F0EBE1', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', fontWeight: 600, color: tier.color }}>{m.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...labelStyle, marginBottom: '0.3rem' }}>Stored Items</div>
        {tier.items.map((item, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 50px', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 0.5rem', marginBottom: '0.2rem', borderRadius: '6px',
            background: i === 0 ? tier.color + '08' : 'transparent',
          }}>
            <span style={{ fontSize: '0.78rem', color: '#2C3E2D' }}>{item.text}</span>
            <span style={{ fontSize: '0.68rem', color: '#B0A898', textAlign: 'right' }}>{item.age}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <div style={{ flex: 1, height: '4px', background: '#E5DFD3', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.relevance * 100}%`, background: tier.color, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#7A8B7C' }}>{item.relevance.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowFlow(!showFlow)} style={{
        padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
        border: '1px solid #D4A843', background: showFlow ? 'rgba(212, 168, 67, 0.1)' : 'transparent',
        color: '#9A7A2E', fontWeight: 500, fontFamily: "'Source Sans 3', system-ui, sans-serif",
      }}>{showFlow ? 'Hide' : 'Show'} Memory Flow</button>
    </div>
  );
}
