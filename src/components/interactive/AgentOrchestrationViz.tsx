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

interface PatternStep {
  name: string;
  status: 'pending' | 'active' | 'done';
  column: number;
  row: number;
}

const patterns = [
  {
    id: 'sequential',
    name: 'Sequential Pipeline',
    desc: 'Tasks flow one after another in a strict order. Output of each step feeds the next.',
    color: '#5B8DB8',
    example: 'Document processing: Extract → Classify → Summarize → Store',
    steps: [
      { name: 'Extract Text', column: 0, row: 0 },
      { name: 'Classify Type', column: 1, row: 0 },
      { name: 'Summarize', column: 2, row: 0 },
      { name: 'Store Result', column: 3, row: 0 },
    ],
    pros: 'Simple, deterministic, easy to debug',
    cons: 'Slow — no parallelism, bottleneck at slowest step',
  },
  {
    id: 'parallel',
    name: 'Parallel Fan-Out',
    desc: 'A coordinator distributes subtasks to multiple agents simultaneously, then aggregates results.',
    color: '#D4A843',
    example: 'Market research: Send to [competitor analyst, trend analyst, customer analyst] → Merge',
    steps: [
      { name: 'Coordinator', column: 0, row: 1 },
      { name: 'Competitor Analysis', column: 1, row: 0 },
      { name: 'Trend Analysis', column: 1, row: 1 },
      { name: 'Customer Analysis', column: 1, row: 2 },
      { name: 'Merge Results', column: 2, row: 1 },
    ],
    pros: 'Fast — parallel execution, good for independent subtasks',
    cons: 'Complex aggregation, no inter-task communication',
  },
  {
    id: 'hierarchical',
    name: 'Hierarchical Delegation',
    desc: 'A manager agent breaks down tasks and delegates to specialist sub-agents, who may delegate further.',
    color: '#8BA888',
    example: 'Software project: Manager → [Frontend team, Backend team, QA team]',
    steps: [
      { name: 'Manager Agent', column: 0, row: 1 },
      { name: 'Frontend Lead', column: 1, row: 0 },
      { name: 'Backend Lead', column: 1, row: 2 },
      { name: 'UI Agent', column: 2, row: 0 },
      { name: 'API Agent', column: 2, row: 1 },
      { name: 'DB Agent', column: 2, row: 2 },
      { name: 'QA Agent', column: 3, row: 1 },
    ],
    pros: 'Handles complexity, mirrors org structure, specialized agents',
    cons: 'Communication overhead, potential for misalignment',
  },
];

export default function AgentOrchestrationViz() {
  const [patternIdx, setPatternIdx] = useState(0);
  const [animStep, setAnimStep] = useState(0);

  const pattern = patterns[patternIdx];
  const maxCol = Math.max(...pattern.steps.map(s => s.column));

  const getStatus = (stepIdx: number): 'done' | 'active' | 'pending' => {
    const step = pattern.steps[stepIdx];
    if (pattern.id === 'sequential') {
      if (stepIdx < animStep) return 'done';
      if (stepIdx === animStep) return 'active';
      return 'pending';
    }
    if (pattern.id === 'parallel') {
      if (step.column < animStep) return 'done';
      if (step.column === animStep) return 'active';
      return 'pending';
    }
    // hierarchical
    if (step.column < animStep) return 'done';
    if (step.column === animStep) return 'active';
    return 'pending';
  };

  const maxAnim = pattern.id === 'sequential' ? pattern.steps.length - 1 : maxCol;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Agent Orchestration Patterns
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore three common multi-agent orchestration patterns. Step through each to see the task flow.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {patterns.map((p, i) => (
          <button key={p.id} onClick={() => { setPatternIdx(i); setAnimStep(0); }} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
            border: `1px solid ${patternIdx === i ? p.color : '#E5DFD3'}`,
            background: patternIdx === i ? p.color + '12' : 'transparent',
            color: patternIdx === i ? p.color : '#5A6B5C', fontWeight: patternIdx === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{p.name}</button>
        ))}
      </div>

      <div style={{ padding: '0.6rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', color: '#5A6B5C' }}>
        {pattern.desc}
      </div>

      <div style={{ padding: '0.5rem 0.8rem', background: '#2C3E2D', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.75rem', color: '#8BA888', fontFamily: "'JetBrains Mono', monospace" }}>
        {pattern.example}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maxCol + 1}, 1fr)`, gap: '0.5rem', marginBottom: '1rem', minHeight: '120px', alignContent: 'center' }}>
        {Array.from({ length: (maxCol + 1) * 3 }).map((_, cellIdx) => {
          const col = cellIdx % (maxCol + 1);
          const row = Math.floor(cellIdx / (maxCol + 1));
          const step = pattern.steps.find(s => s.column === col && s.row === row);
          if (!step) return <div key={cellIdx} />;

          const stepIdx = pattern.steps.indexOf(step);
          const status = getStatus(stepIdx);
          const statusColor = status === 'active' ? pattern.color : status === 'done' ? '#8BA888' : '#E5DFD3';

          return (
            <div key={cellIdx} style={{
              padding: '0.5rem 0.6rem', borderRadius: '8px', textAlign: 'center',
              border: `2px solid ${statusColor}`,
              background: status === 'active' ? pattern.color + '12' : status === 'done' ? 'rgba(139, 168, 136, 0.08)' : '#F5F0E8',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: status === 'pending' ? '#B0A898' : '#2C3E2D' }}>
                {step.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: statusColor, fontWeight: 600, marginTop: '0.2rem' }}>
                {status === 'done' ? '✓ Done' : status === 'active' ? '● Running' : '○ Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.5rem 0.7rem', background: 'rgba(139, 168, 136, 0.08)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.2rem' }}>Pros</div>
          <div style={{ fontSize: '0.75rem', color: '#5A6B5C' }}>{pattern.pros}</div>
        </div>
        <div style={{ padding: '0.5rem 0.7rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.2rem' }}>Cons</div>
          <div style={{ fontSize: '0.75rem', color: '#5A6B5C' }}>{pattern.cons}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={() => setAnimStep(Math.max(0, animStep - 1))} disabled={animStep === 0} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: animStep === 0 ? 'not-allowed' : 'pointer',
          border: '1px solid #E5DFD3', background: 'transparent',
          color: animStep === 0 ? '#B0A898' : '#5A6B5C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Back</button>
        <button onClick={() => setAnimStep(Math.min(maxAnim, animStep + 1))} disabled={animStep >= maxAnim} style={{
          padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem',
          cursor: animStep >= maxAnim ? 'not-allowed' : 'pointer',
          border: '1px solid #C76B4A', background: animStep >= maxAnim ? '#E5DFD3' : 'rgba(199, 107, 74, 0.08)',
          color: animStep >= maxAnim ? '#B0A898' : '#C76B4A', fontWeight: 600,
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Next</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#7A8B7C' }}>
          Phase {animStep + 1} / {maxAnim + 1}
        </span>
        <button onClick={() => setAnimStep(0)} style={{
          marginLeft: 'auto', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem',
          cursor: 'pointer', border: '1px solid #E5DFD3', background: 'transparent', color: '#7A8B7C',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>Reset</button>
      </div>
    </div>
  );
}
