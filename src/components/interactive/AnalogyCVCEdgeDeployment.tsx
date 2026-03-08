import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCEdgeDeployment() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a security camera that needs to detect intruders in under 50 milliseconds, runs on a 5-watt chip, and has no internet connection. Cloud inference is not an option -- the model must run on the device itself.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Quantization reduces the precision of weights and activations from 32-bit floating point (FP32) to lower bit-widths. INT8 Quantization: The most common production format. Maps FP32 values to 8-bit integers using a scale factor s and zero point z:  [equation]  Two approaches: Post-Training Quantization (PTQ): Calibrate scale factors using a small.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, edge deployment encompasses model compression (quantization, pruning, distillation), hardware-aware architecture design (MobileNets, EfficientNets), inference runtime optimization (TensorRT, ONNX Runtime, TFLite), and the engineering of meeting real-time latency, memory, and power constraints.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
