import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyQuantization() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🗺️', label: 'Map Resolution', text: 'A 16-bit model is like a detailed topographic map. Quantization to 4-bit is like switching to a simpler road map — you lose elevation contours but streets are still accurate. Each weight goes from a precise decimal (float16) to a coarser approximation (int4/int8). The model gets 2-4x smaller and faster with surprisingly little quality loss because neural networks are robust to small perturbations.' },
    { emoji: '🎵', label: 'Audio Bitrate', text: 'Reducing a song from WAV (1411 kbps) to MP3 (128 kbps) cuts the file to 1/10th the size and most listeners can\'t tell the difference. Quantization does the same for model weights: going from 16-bit to 4-bit floats shrinks the model by 4x. Like MP3, clever quantization (GPTQ, AWQ) preserves the important information and discards what won\'t be missed.' },
    { emoji: '📏', label: 'Rounding Measurements', text: 'Instead of measuring a room as 3.7842 meters, you round to 3.8m — close enough for furniture shopping. Quantization rounds billions of model weights from high-precision floats to low-precision integers. The individual rounding errors are tiny, but the memory savings are enormous. A 70B model that needs 140GB at fp16 fits in 35GB at 4-bit — suddenly runnable on consumer GPUs.' },
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
