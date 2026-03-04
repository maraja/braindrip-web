import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyQLoRA() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🗜', label: 'Compressed + Sticky Notes', text: 'QLoRA combines two tricks: compress the textbook into a pocket edition (4-bit quantized base model) and add sticky notes on top (LoRA adapters in full precision). The base model is frozen and stored in 4-bit NormalFloat format, cutting memory by 4x. The LoRA adapters train in BF16 for quality. Backpropagation flows through the quantized weights using double quantization. Result: fine-tune a 65B model on a single 48GB GPU.' },
    { emoji: '📱', label: 'Phone + Case', text: 'QLoRA is like running a compressed app (quantized model) and adding a custom phone case (LoRA adapter). The app is shrunk to fit in limited phone memory (4-bit quantization), while the case adds the personalization (trainable adapter weights in higher precision). Key innovation: paged optimizers use CPU RAM as overflow when GPU memory peaks, like virtual memory for fine-tuning.' },
    { emoji: '🏠', label: 'Tiny House + Mods', text: 'QLoRA lets you fine-tune a mansion-sized model in a tiny-house-sized GPU. The mansion is compressed to fit (4-bit quantization of the 65B base model), and then you make small modifications (LoRA in BF16). The NF4 data type is specifically designed for normally-distributed neural network weights, and double quantization compresses even the quantization constants. This democratized LLM fine-tuning for researchers without massive compute.' },
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
