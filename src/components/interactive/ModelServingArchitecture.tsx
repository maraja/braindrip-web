import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Component = 'client' | 'lb' | 'gateway' | 'workers' | 'kvcache';

const components: Record<Component, { label: string; icon: string; color: string; desc: string; metrics: string[] }> = {
  client: { label: 'Client', icon: '\u2709', color: '#9B7DB8', desc: 'Sends requests with prompts and parameters (temperature, max_tokens). Receives streamed token responses via SSE.', metrics: ['Requests/sec: ~100-1000', 'Avg prompt: 500 tokens', 'Streaming latency: <50ms/token'] },
  lb: { label: 'Load Balancer', icon: '\u2696', color: '#C76B4A', desc: 'Distributes requests across model workers. Uses least-connections or prefix-aware routing to maximize KV cache hits.', metrics: ['Algorithm: Least-connections', 'Health checks: 5s interval', 'Session affinity: prefix-hash'] },
  gateway: { label: 'API Gateway', icon: '\u26A1', color: '#D4A843', desc: 'Handles authentication, rate limiting, request validation, and usage tracking. Transforms requests to internal format.', metrics: ['Rate limit: 60 req/min/user', 'Auth: API key + JWT', 'Logging: structured JSON'] },
  workers: { label: 'Model Workers', icon: '\u2699', color: '#8BA888', desc: 'GPU instances running the model. Each worker handles continuous batching, manages its own KV cache, and runs inference.', metrics: ['GPUs: A100 80GB each', 'Batch size: 32-256 dynamic', 'Model: tensor-parallel across GPUs'] },
  kvcache: { label: 'KV Cache Pool', icon: '\u29C9', color: '#5B8DB8', desc: 'Shared paged memory pool for key-value caches. Uses virtual memory with page tables for efficient allocation and prefix sharing.', metrics: ['Page size: 16 tokens', 'Utilization: >95%', 'Prefix sharing: automatic'] },
};

const flow: Component[] = ['client', 'lb', 'gateway', 'workers', 'kvcache'];

export default function ModelServingArchitecture() {
  const [selected, setSelected] = useState<Component>('workers');
  const [step, setStep] = useState(0);
  const comp = components[selected];

  const flowSteps = [
    { from: 'client', to: 'lb', label: '1. Send request' },
    { from: 'lb', to: 'gateway', label: '2. Route to gateway' },
    { from: 'gateway', to: 'workers', label: '3. Forward to worker' },
    { from: 'workers', to: 'kvcache', label: '4. Allocate KV pages' },
    { from: 'kvcache', to: 'workers', label: '5. Return cached KV' },
    { from: 'workers', to: 'client', label: '6. Stream tokens back' },
  ];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Model Serving Architecture
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each component to explore a production LLM serving stack. Step through the request flow.
        </p>
      </div>

      {/* Architecture diagram */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          {flow.map((id, i) => {
            const c = components[id];
            const isActive = selected === id;
            const inFlow = step < flowSteps.length && (flowSteps[step].from === id || flowSteps[step].to === id);
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <button onClick={() => setSelected(id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  padding: '0.6rem 0.7rem', borderRadius: '10px', cursor: 'pointer',
                  border: `2px solid ${isActive ? c.color : inFlow ? c.color + '80' : '#E5DFD3'}`,
                  background: isActive ? `${c.color}15` : '#FDFBF7',
                  transition: 'all 0.2s',
                  minWidth: '70px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, color: isActive ? c.color : '#5A6B5C' }}>{c.label}</span>
                </button>
                {i < flow.length - 1 && (
                  <span style={{ color: '#C76B4A', fontSize: '0.9rem', fontWeight: 600 }}>{'\u2192'}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow stepper */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#7A8B7C', textTransform: 'uppercase' }}>Request Flow</span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {flowSteps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer',
                border: `1px solid ${step === i ? '#C76B4A' : '#E5DFD3'}`,
                background: step === i ? '#C76B4A' : 'transparent',
                color: step === i ? '#fff' : '#5A6B5C',
                fontSize: '0.6rem', fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.78rem', color: '#2C3E2D' }}>
          <strong style={{ color: '#C76B4A' }}>{flowSteps[step].label}</strong>
          <span style={{ color: '#7A8B7C' }}> ({flowSteps[step].from} {'\u2192'} {flowSteps[step].to})</span>
        </div>
      </div>

      {/* Component detail */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: comp.color, marginBottom: '0.4rem' }}>
          {comp.icon} {comp.label}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#2C3E2D', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>{comp.desc}</p>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Key Metrics</div>
        {comp.metrics.map((m, i) => (
          <div key={i} style={{ fontSize: '0.72rem', color: '#5A6B5C', padding: '0.2rem 0', fontFamily: "'JetBrains Mono', monospace" }}>
            {m}
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        Production serving stacks separate concerns: the gateway handles auth and rate limiting, the load balancer maximizes cache hits via prefix-aware routing, and workers focus purely on inference with shared KV cache pools.
      </div>
    </div>
  );
}
