import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SYSTEM_PROMPT = 'You are a helpful AI assistant. Follow these rules: be concise, be accurate, cite sources...';
const SYSTEM_TOKENS = 42;

const requests = [
  { id: 1, user: 'What is photosynthesis?', userTokens: 8 },
  { id: 2, user: 'Explain quantum entanglement.', userTokens: 7 },
  { id: 3, user: 'How does TCP/IP work?', userTokens: 9 },
  { id: 4, user: 'What causes tides?', userTokens: 6 },
];

export default function PrefixCachingDemo() {
  const [cachingEnabled, setCachingEnabled] = useState(false);
  const [activeReq, setActiveReq] = useState(0);

  const prefillTimePerToken = 0.8; // ms
  const cachedLookupTime = 0.5; // ms total for cache hit

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prefix Caching (Prompt Caching)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Toggle caching to see how shared system prompts avoid redundant KV cache computation.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[false, true].map(v => (
          <button key={String(v)} onClick={() => setCachingEnabled(v)} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${cachingEnabled === v ? (v ? '#8BA888' : '#C76B4A') : '#E5DFD3'}`,
            background: cachingEnabled === v ? (v ? 'rgba(139,168,136,0.08)' : 'rgba(199,107,74,0.08)') : 'transparent',
            color: cachingEnabled === v ? (v ? '#8BA888' : '#C76B4A') : '#5A6B5C',
            fontWeight: cachingEnabled === v ? 600 : 400, fontSize: '0.78rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {v ? 'Caching ON' : 'Caching OFF'}
          </button>
        ))}
      </div>

      {/* Shared prefix display */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          Shared System Prompt ({SYSTEM_TOKENS} tokens)
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#5A6B5C', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
          {SYSTEM_PROMPT}
        </div>
      </div>

      {/* Request timeline */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Request Processing
        </div>
        {requests.map((req, idx) => {
          const isActive = idx === activeReq;
          const prefixTime = cachingEnabled && idx > 0 ? cachedLookupTime : SYSTEM_TOKENS * prefillTimePerToken;
          const userTime = req.userTokens * prefillTimePerToken;
          const totalTTFT = prefixTime + userTime;
          const noCacheTTFT = SYSTEM_TOKENS * prefillTimePerToken + userTime;
          const saving = noCacheTTFT - totalTTFT;
          const maxTime = SYSTEM_TOKENS * prefillTimePerToken + 10 * prefillTimePerToken;
          const prefixWidth = (prefixTime / maxTime) * 100;
          const userWidth = (userTime / maxTime) * 100;

          return (
            <div key={req.id} onClick={() => setActiveReq(idx)} style={{
              padding: '0.5rem', marginBottom: '0.4rem', borderRadius: '6px', cursor: 'pointer',
              background: isActive ? '#FDFBF7' : 'transparent',
              border: isActive ? '1px solid #E5DFD3' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C3E2D' }}>
                  Req {req.id}: {req.user}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: saving > 0 ? '#8BA888' : '#5A6B5C', fontWeight: 600 }}>
                  TTFT: {totalTTFT.toFixed(1)}ms {saving > 0 ? `(-${saving.toFixed(1)}ms)` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', height: '18px', borderRadius: '4px', overflow: 'hidden', gap: '1px' }}>
                <div style={{
                  width: `${prefixWidth}%`, background: cachingEnabled && idx > 0 ? '#8BA888' : '#C76B4A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.5rem', color: '#fff', fontWeight: 600, transition: 'width 0.3s',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {cachingEnabled && idx > 0 ? 'CACHED' : 'prefix'}
                </div>
                <div style={{
                  width: `${userWidth}%`, background: '#D4A843',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.5rem', color: '#fff', fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  user
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C76B4A' }} />
            <span style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>Compute prefix KV</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#8BA888' }} />
            <span style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>Cache hit (reuse KV)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#D4A843' }} />
            <span style={{ fontSize: '0.6rem', color: '#5A6B5C' }}>User prompt KV</span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Avg TTFT</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: cachingEnabled ? '#8BA888' : '#C76B4A' }}>
            {cachingEnabled ? '7.4' : '40.0'}ms
          </div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Prefix Reuse</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>
            {cachingEnabled ? '75%' : '0%'}
          </div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Compute Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#8BA888' }}>
            {cachingEnabled ? '~80%' : '0%'}
          </div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: '3px solid #C76B4A', fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        {cachingEnabled
          ? 'With prefix caching, the system prompt KV cache is computed once and reused for subsequent requests. The first request still pays full cost, but requests 2-4 skip prefix computation entirely, reducing TTFT by ~80%.'
          : 'Without caching, every request must recompute the KV cache for the entire system prompt. For a 42-token prefix, this wastes ~33ms of compute per request that could be avoided.'}
      </div>
    </div>
  );
}
