import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyKVCacheCompression() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Meeting Notes', text: 'Instead of recording every word of a 3-hour meeting, you keep condensed notes that capture the key points. KV cache compression does the same — it reduces the memory footprint of stored attention states by quantizing values to lower precision, evicting less important entries, or merging similar keys. You keep the essential information while freeing up GPU memory for more requests.' },
    { emoji: '🗃️', label: 'Archive Filing', text: 'A busy office keeps recent documents on the desk but compresses older files into storage boxes. Similarly, KV cache compression might keep recent tokens at full precision while quantizing older tokens to 4-bit or 8-bit, or even dropping the least-attended tokens entirely. The most relevant context stays sharp; the rest is stored efficiently.' },
    { emoji: '🖼️', label: 'Image Compression', text: 'Just like JPEG compresses photos by discarding details the eye won\'t notice, KV cache compression reduces precision or drops cache entries that contribute little to attention scores. Techniques like grouped-query attention (GQA) share KV heads, quantization reduces bit-width, and eviction policies drop low-attention tokens — all to fit longer contexts in limited GPU memory.' },
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
