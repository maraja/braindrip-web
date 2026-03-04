import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyByteLatentTransformers() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🔬', label: 'Microscope Zoom', text: 'Byte Latent Transformers work at the raw byte level (maximum zoom) but intelligently group bytes into patches before the heavy transformer processing. It is like a scientist who first scans a slide at low magnification to find interesting regions, then zooms in where needed. The expensive transformer only processes the compressed patches, not every single byte.' },
    { emoji: '📦', label: 'Package Sorting', text: 'Instead of a fixed tokenizer deciding word boundaries upfront, BLT reads raw bytes and dynamically groups them into "packages" (patches) based on content complexity. Simple regions get bundled into large packages; complex regions get small, careful packages. This eliminates the rigid vocabulary and lets the model handle any language, code, or data natively.' },
    { emoji: '🗜', label: 'Smart Compression', text: 'Traditional tokenizers are like a fixed compression dictionary decided before seeing the data. BLT is like adaptive compression: it reads the raw bytes, groups them into variable-size chunks based on entropy (predictability), then processes these compressed chunks with the expensive transformer. High-entropy (surprising) bytes get more compute; predictable bytes get compressed aggressively.' },
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
