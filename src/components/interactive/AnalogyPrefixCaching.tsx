import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPrefixCaching() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📄', label: 'Letterhead Template', text: 'If every letter to clients starts with the same company header and legal boilerplate, you pre-print that part and only handwrite the unique content. Prefix caching pre-computes the KV cache for shared system prompts or common prefixes so every request that shares that prefix skips the expensive prefill step and jumps straight to the unique part.' },
    { emoji: '🏗️', label: 'Foundation Reuse', text: 'Building 10 houses on the same blueprint? Pour the foundation once and reuse it. Prefix caching computes the KV states for a shared prompt prefix once, then clones that cached foundation for each new request. This is especially powerful when many users share the same system prompt — you avoid redundantly processing identical tokens over and over.' },
    { emoji: '🎵', label: 'Karaoke Backing Track', text: 'In karaoke, the backing music is pre-recorded and every singer shares it — only the vocals differ. Prefix caching is the backing track: the shared system prompt is processed once, cached, and reused. Each user\'s unique query is the vocal part that gets processed fresh on top of the cached prefix. This can cut time-to-first-token dramatically.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
