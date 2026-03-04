import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const systemPrompt = 'You are a helpful customer support agent for Acme Corp. Follow company guidelines...';
const requests = [
  { id: 'Req A', user: 'How do I reset my password?', uniqueTokens: 8, color: '#C76B4A' },
  { id: 'Req B', user: 'What is your refund policy?', uniqueTokens: 7, color: '#D4A843' },
  { id: 'Req C', user: 'Track my order #12345', uniqueTokens: 6, color: '#6B8EC7' },
  { id: 'Req D', user: 'Cancel my subscription', uniqueTokens: 5, color: '#9B6BC7' },
];

const sharedPrefixTokens = 24;

export default function PrefixSharingViz() {
  const [numRequests, setNumRequests] = useState(4);
  const [showSharing, setShowSharing] = useState(true);

  const active = requests.slice(0, numRequests);
  const withoutSharing = active.reduce((s, r) => s + sharedPrefixTokens + r.uniqueTokens, 0);
  const withSharing = sharedPrefixTokens + active.reduce((s, r) => s + r.uniqueTokens, 0);
  const memorySaved = Math.round((1 - withSharing / withoutSharing) * 100);

  const blockSize = 42;
  const sharedBlocks = Math.ceil(sharedPrefixTokens / 4);
  const totalBlocks = Math.ceil(sharedPrefixTokens / 4);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          KV Cache Prefix Sharing
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Multiple requests sharing a system prompt can reuse the same KV cache prefix.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>
            Concurrent Requests: {numRequests}
          </label>
          <input type="range" min={1} max={4} value={numRequests}
            onChange={e => setNumRequests(Number(e.target.value))}
            style={{ width: '140px', accentColor: '#C76B4A' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[true, false].map(v => (
            <button key={String(v)} onClick={() => setShowSharing(v)} style={{
              padding: '0.35rem 0.7rem', borderRadius: '6px',
              border: `1px solid ${showSharing === v ? '#C76B4A' : '#E5DFD3'}`,
              background: showSharing === v ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
              color: showSharing === v ? '#C76B4A' : '#5A6B5C',
              fontWeight: showSharing === v ? 600 : 400, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {v ? 'Sharing On' : 'Sharing Off'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          KV Cache Memory Layout
        </div>

        {showSharing && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#8BA888', fontWeight: 600, marginBottom: '0.3rem' }}>
              Shared Prefix (computed once)
            </div>
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
              {Array.from({ length: sharedBlocks }).map((_, i) => (
                <div key={i} style={{
                  width: '18px', height: '18px', borderRadius: '3px',
                  background: '#8BA888', opacity: 0.7 + (i / sharedBlocks) * 0.3,
                }} />
              ))}
            </div>
          </div>
        )}

        {active.map(req => {
          const uniqueBlocks = Math.ceil(req.uniqueTokens / 4);
          return (
            <div key={req.id} style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#5A6B5C', fontWeight: 600, marginBottom: '0.2rem' }}>
                {req.id}: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 400, fontSize: '0.65rem' }}>{req.user}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                {!showSharing && Array.from({ length: sharedBlocks }).map((_, i) => (
                  <div key={`s-${i}`} style={{
                    width: '18px', height: '18px', borderRadius: '3px',
                    background: '#8BA888', opacity: 0.5,
                  }} />
                ))}
                {showSharing && Array.from({ length: sharedBlocks }).map((_, i) => (
                  <div key={`r-${i}`} style={{
                    width: '18px', height: '18px', borderRadius: '3px',
                    border: '1.5px dashed #8BA888', background: 'transparent',
                  }} />
                ))}
                {Array.from({ length: uniqueBlocks }).map((_, i) => (
                  <div key={`u-${i}`} style={{
                    width: '18px', height: '18px', borderRadius: '3px',
                    background: req.color, opacity: 0.7 + (i / uniqueBlocks) * 0.3,
                  }} />
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.65rem', color: '#7A8B7C' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#8BA888' }} /> Shared prefix
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1.5px dashed #8BA888' }} /> Reference (no copy)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C76B4A' }} /> Unique per-request
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Without Sharing</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#C76B4A' }}>{withoutSharing} blocks</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>With Sharing</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>{withSharing} blocks</div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.7rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Memory Saved</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#D4A843' }}>{memorySaved}%</div>
        </div>
      </div>
    </div>
  );
}
