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

const agents = [
  { id: 'researcher', name: 'Researcher', color: '#5B8DB8', icon: '🔬', role: 'Gathers evidence and presents findings' },
  { id: 'critic', name: 'Critic', color: '#C76B4A', icon: '🔍', role: 'Challenges claims and identifies weaknesses' },
  { id: 'synthesizer', name: 'Synthesizer', color: '#8BA888', icon: '🧩', role: 'Integrates viewpoints into a coherent conclusion' },
];

const turns = [
  { agent: 'researcher', text: 'Based on recent studies, remote work increases productivity by 13% on average. Key factors include reduced commute stress, flexible scheduling, and fewer office interruptions. Stanford research (Bloom et al.) provides strong evidence.' },
  { agent: 'critic', text: 'The 13% figure comes from a specific call-center context and may not generalize. Several concerns: 1) Collaboration-heavy roles may suffer. 2) Junior employees miss mentorship. 3) The study predates modern remote tools. We need more nuanced data.' },
  { agent: 'researcher', text: 'Fair points. Updated findings from 2023 meta-analyses show productivity gains vary: +15% for individual contributor roles, but -5% for highly collaborative teams. Hybrid models (3 days office, 2 remote) show best results across all role types.' },
  { agent: 'critic', text: 'The hybrid model data is stronger, but we should address: 1) Measurement methodology differs across studies. 2) Self-reported productivity is unreliable. 3) Long-term effects (2+ years) are still unclear. What about employee retention data?' },
  { agent: 'researcher', text: 'Good question. Retention data shows: companies offering remote options have 25% lower turnover. However, fully remote companies also report higher rates of "quiet quitting" and disengagement after 18 months. The hybrid model again shows best retention outcomes.' },
  { agent: 'synthesizer', text: 'Synthesizing both perspectives:\n\n1. Remote work boosts individual productivity but can hinder collaboration\n2. The optimal model is hybrid (3/2 split), supported by both productivity and retention data\n3. Key caveats: results vary by role type, measurement challenges remain, and long-term data is still emerging\n4. Recommendation: Organizations should implement hybrid models with flexibility, while investing in structured collaboration time and mentorship programs for remote workers.' },
];

export default function MultiAgentDebateViz() {
  const [visibleTurns, setVisibleTurns] = useState(1);

  const isLast = visibleTurns >= turns.length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Multi-Agent Debate
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Watch three agents with distinct roles collaborate through structured debate. Topic: "Does remote work improve productivity?"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {agents.map(a => {
          const hasSpoken = turns.slice(0, visibleTurns).some(t => t.agent === a.id);
          return (
            <div key={a.id} style={{
              padding: '0.5rem 0.7rem', borderRadius: '8px', textAlign: 'center',
              background: hasSpoken ? a.color + '10' : '#F5F0E8',
              border: `1px solid ${hasSpoken ? a.color + '44' : '#E5DFD3'}`,
              opacity: hasSpoken ? 1 : 0.5, transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{a.icon}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: a.color }}>{a.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>{a.role}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {turns.slice(0, visibleTurns).map((turn, i) => {
          const agent = agents.find(a => a.id === turn.agent)!;
          const isCurrent = i === visibleTurns - 1;
          return (
            <div key={i} style={{
              display: 'flex', gap: '0.6rem', padding: '0.6rem 0.75rem', marginBottom: '0.4rem',
              borderRadius: '8px', transition: 'all 0.25s ease',
              background: isCurrent ? agent.color + '08' : 'transparent',
              border: `1px solid ${isCurrent ? agent.color + '33' : 'transparent'}`,
              opacity: isCurrent ? 1 : 0.75,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px', gap: '0.2rem' }}>
                <span style={{ fontSize: '1rem' }}>{agent.icon}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: agent.color, textTransform: 'uppercase' }}>{agent.name}</span>
              </div>
              <div style={{ flex: 1, fontSize: '0.82rem', color: '#2C3E2D', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {turn.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => setVisibleTurns(Math.max(1, visibleTurns - 1))} disabled={visibleTurns <= 1} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: visibleTurns <= 1 ? 'not-allowed' : 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent',
          color: visibleTurns <= 1 ? '#B0A898' : '#5A6B5C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Back</button>
        <button onClick={() => setVisibleTurns(Math.min(turns.length, visibleTurns + 1))} disabled={isLast} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: isLast ? 'not-allowed' : 'pointer',
          border: '1px solid #C76B4A', background: isLast ? '#E5DFD3' : 'rgba(199, 107, 74, 0.08)',
          color: isLast ? '#B0A898' : '#C76B4A', fontWeight: 600,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Next Turn</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#7A8B7C' }}>
          Turn {visibleTurns} / {turns.length}
        </span>
        {isLast && (
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: 600, color: '#8BA888' }}>Debate Complete</span>
        )}
      </div>
    </div>
  );
}
