import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const TASKS = [
  { name: 'Code', adapter: 'code-lora-r16', color: '#C76B4A', prompt: 'Write a Python function to sort a linked list', response: 'def sort_linked_list(head):\n  if not head or not head.next:\n    return head\n  ...', size: '16.4 MB' },
  { name: 'Medical', adapter: 'medical-lora-r8', color: '#8BA888', prompt: 'Explain the mechanism of action of metformin', response: 'Metformin primarily works by reducing hepatic glucose production and improving insulin sensitivity...', size: '8.2 MB' },
  { name: 'Legal', adapter: 'legal-lora-r16', color: '#D4A843', prompt: 'Draft a non-compete clause for an employment contract', response: 'The Employee agrees that for a period of [X] months following termination...', size: '16.4 MB' },
  { name: 'Creative', adapter: 'creative-lora-r4', color: '#9B7EC8', prompt: 'Write a haiku about machine learning', response: 'Weights shift like seasons\nGradients flow through hidden paths\nPatterns bloom in math', size: '4.1 MB' },
];

type Phase = 'idle' | 'unloading' | 'loading' | 'processing' | 'done';

export default function LoRASwapDemo() {
  const [activeTask, setActiveTask] = useState(0);
  const [prevTask, setPrevTask] = useState(-1);
  const [phase, setPhase] = useState<Phase>('done');

  const swapTo = (idx: number) => {
    if (idx === activeTask && phase === 'done') return;
    setPrevTask(activeTask);
    setPhase('unloading');
    setTimeout(() => {
      setPhase('loading');
      setTimeout(() => {
        setActiveTask(idx);
        setPhase('processing');
        setTimeout(() => setPhase('done'), 800);
      }, 600);
    }, 400);
  };

  const task = TASKS[activeTask];
  const phaseLabels: Record<Phase, string> = {
    idle: 'Idle',
    unloading: `Unloading ${TASKS[prevTask]?.name || ''} adapter...`,
    loading: `Loading ${TASKS[activeTask]?.name || ''} adapter...`,
    processing: 'Generating response...',
    done: 'Complete',
  };

  const phaseColors: Record<Phase, string> = {
    idle: '#5A6B5C', unloading: '#D4A843', loading: '#C76B4A', processing: '#8BA888', done: '#2C3E2D',
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          LoRA Hot-Swap Demo
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {TASKS.map((t, i) => (
          <button key={t.name} onClick={() => swapTo(i)} disabled={phase !== 'done' && phase !== 'idle'} style={{
            padding: '0.6rem 0.4rem', borderRadius: '8px',
            border: `1.5px solid ${i === activeTask ? t.color : '#E5DFD3'}`,
            background: i === activeTask ? `${t.color}12` : '#FDFBF7',
            cursor: phase === 'done' || phase === 'idle' ? 'pointer' : 'not-allowed',
            fontSize: '0.78rem', fontWeight: i === activeTask ? 600 : 400,
            color: i === activeTask ? t.color : '#5A6B5C',
            fontFamily: "'Source Sans 3', system-ui, sans-serif", transition: 'all 0.2s',
            opacity: (phase !== 'done' && phase !== 'idle') ? 0.5 : 1,
          }}>
            <div>{t.name}</div>
            <div style={{ fontSize: '0.6rem', marginTop: '0.2rem', opacity: 0.7 }}>{t.size}</div>
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: phaseColors[phase],
            boxShadow: phase !== 'done' && phase !== 'idle' ? `0 0 8px ${phaseColors[phase]}60` : 'none',
            animation: phase !== 'done' && phase !== 'idle' ? undefined : undefined,
          }} />
          <span style={{ fontSize: '0.85rem', color: phaseColors[phase], fontWeight: 500 }}>
            {phaseLabels[phase]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
          {['unloading', 'loading', 'processing', 'done'].map((p, i) => (
            <div key={p} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: (['unloading', 'loading', 'processing', 'done'].indexOf(phase) >= i) ? task.color : 'rgba(44,62,45,0.08)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.6rem', color: '#999' }}>
          <span>Unload</span><span>Load</span><span>Process</span><span>Done</span>
        </div>
      </div>

      {/* Model diagram */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5A6B5C', marginBottom: '0.5rem' }}>Base Model + Active Adapter</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
            <div style={{ flex: 3, background: 'rgba(44,62,45,0.08)', borderRadius: '6px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2C3E2D' }}>LLaMA-7B</div>
                <div style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>Frozen weights</div>
              </div>
            </div>
            <div style={{
              flex: 1, borderRadius: '6px', padding: '0.5rem',
              background: `${task.color}15`, border: `1.5px solid ${task.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s',
              opacity: phase === 'unloading' ? 0.3 : phase === 'loading' ? 0.7 : 1,
            }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: task.color, fontWeight: 600 }}>
                  {task.adapter}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#5A6B5C' }}>{task.size}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(212,168,67,0.04)', borderRadius: '10px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.5rem' }}>Latency Breakdown</div>
          {[
            { label: 'Unload prev', ms: '0.4' },
            { label: 'Load adapter', ms: '0.6' },
            { label: 'Inference', ms: '~50-200' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.2rem 0', borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
              <span style={{ color: '#5A6B5C' }}>{item.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D' }}>{item.ms}ms</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.25rem 0', fontWeight: 600 }}>
            <span style={{ color: '#2C3E2D' }}>Swap overhead</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>~1ms</span>
          </div>
        </div>
      </div>

      {phase === 'done' && (
        <div style={{ background: `${task.color}08`, borderRadius: '10px', padding: '0.75rem', border: `1px solid ${task.color}20` }}>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.25rem' }}>Prompt:</div>
          <div style={{ fontSize: '0.8rem', color: '#2C3E2D', marginBottom: '0.5rem', fontStyle: 'italic' as const }}>{task.prompt}</div>
          <div style={{ fontSize: '0.7rem', color: '#5A6B5C', marginBottom: '0.25rem' }}>Response ({task.name} adapter):</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: task.color, background: 'rgba(44,62,45,0.04)', padding: '0.5rem', borderRadius: '6px', whiteSpace: 'pre-wrap' as const }}>
            {task.response}
          </div>
        </div>
      )}
    </div>
  );
}
