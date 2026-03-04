import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Policy = 'lru' | 'attention' | 'sink_window';

const tokens = ['<BOS>', 'The', 'capital', 'of', 'France', 'is', 'a', 'city', 'known', 'for', 'its', 'art', 'and', 'culture', 'called'];
const attentionScores = [0.72, 0.08, 0.15, 0.04, 0.38, 0.12, 0.03, 0.09, 0.06, 0.05, 0.07, 0.11, 0.04, 0.14, 0.22];

const CACHE_BUDGET = 8;

function getEvicted(policy: Policy): boolean[] {
  const n = tokens.length;
  const kept = new Array(n).fill(false);

  if (policy === 'lru') {
    // Keep most recent CACHE_BUDGET tokens
    for (let i = n - CACHE_BUDGET; i < n; i++) kept[i] = true;
  } else if (policy === 'attention') {
    // Keep top CACHE_BUDGET by attention score
    const indices = Array.from({ length: n }, (_, i) => i);
    indices.sort((a, b) => attentionScores[b] - attentionScores[a]);
    for (let i = 0; i < CACHE_BUDGET; i++) kept[indices[i]] = true;
  } else {
    // Sliding window + attention sinks: keep first 2 (sinks) + last (BUDGET-2) tokens
    kept[0] = true;
    kept[1] = true;
    for (let i = n - (CACHE_BUDGET - 2); i < n; i++) kept[i] = true;
  }

  return kept.map(k => !k);
}

const policies: Record<Policy, { label: string; desc: string; quality: number; color: string }> = {
  lru: { label: 'LRU (Least Recently Used)', desc: 'Evicts the oldest tokens. Simple but loses the beginning of context, including important initial instructions.', quality: 55, color: '#C76B4A' },
  attention: { label: 'Attention-Score Based', desc: 'Keeps tokens with highest cumulative attention scores. Preserves semantically important tokens but requires tracking attention.', quality: 82, color: '#D4A843' },
  sink_window: { label: 'Sliding Window + Sinks', desc: 'Keeps attention sink tokens (first 1-2) plus a sliding window of recent tokens. Combines the benefits of both approaches.', quality: 90, color: '#8BA888' },
};

const policyKeys: Policy[] = ['lru', 'attention', 'sink_window'];

export default function KVCacheEvictionDemo() {
  const [policy, setPolicy] = useState<Policy>('lru');
  const evicted = getEvicted(policy);
  const p = policies[policy];
  const keptCount = evicted.filter(e => !e).length;

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          KV Cache Eviction Policies
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Select an eviction policy to see which tokens are kept (budget: {CACHE_BUDGET}/{tokens.length} tokens).
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {policyKeys.map(k => (
          <button key={k} onClick={() => setPolicy(k)} style={{
            padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${policy === k ? policies[k].color : '#E5DFD3'}`,
            background: policy === k ? `${policies[k].color}12` : 'transparent',
            color: policy === k ? policies[k].color : '#5A6B5C',
            fontWeight: policy === k ? 600 : 400, fontSize: '0.75rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {policies[k].label}
          </button>
        ))}
      </div>

      {/* Token grid with attention scores */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase' }}>
          Token Cache State
        </div>
        {tokens.map((tok, i) => {
          const isEvicted = evicted[i];
          const score = attentionScores[i];
          const isSink = i === 0;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '28px 75px 1fr 45px 55px', alignItems: 'center',
              gap: '0.5rem', padding: '0.25rem 0.4rem', marginBottom: '2px',
              background: isEvicted ? 'rgba(199, 107, 74, 0.06)' : 'rgba(139, 168, 136, 0.08)',
              borderRadius: '4px', transition: 'background 0.2s',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#7A8B7C' }}>
                {i}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem',
                color: isEvicted ? '#999' : isSink ? '#C76B4A' : '#2C3E2D',
                fontWeight: isSink ? 700 : 400,
                textDecoration: isEvicted ? 'line-through' : 'none',
              }}>
                {tok}
              </span>
              <div style={{ height: '10px', background: 'rgba(229,223,211,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(score / 0.72) * 100}%`, borderRadius: '3px',
                  background: isEvicted ? '#ccc' : isSink ? '#C76B4A' : '#8BA888',
                  transition: 'width 0.2s, background 0.2s',
                }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: isEvicted ? '#999' : '#5A6B5C', textAlign: 'right' }}>
                {(score * 100).toFixed(0)}%
              </span>
              <span style={{
                fontSize: '0.6rem', fontWeight: 600, textAlign: 'center', borderRadius: '3px',
                padding: '0.1rem 0.2rem',
                color: isEvicted ? '#C76B4A' : '#8BA888',
                background: isEvicted ? 'rgba(199,107,74,0.08)' : 'rgba(139,168,136,0.08)',
              }}>
                {isEvicted ? 'evicted' : 'kept'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Kept</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#8BA888' }}>{keptCount}/{tokens.length}</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Memory Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#D4A843' }}>{Math.round((1 - keptCount / tokens.length) * 100)}%</div>
        </div>
        <div style={{ padding: '0.65rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.58rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Est. Quality</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700, color: p.color }}>{p.quality}%</div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px', borderLeft: `3px solid ${p.color}`, fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.6 }}>
        <strong style={{ color: p.color }}>{p.label}:</strong> {p.desc}
      </div>
    </div>
  );
}
