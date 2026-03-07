import { useState } from 'react';

const DETAILS = [
    { label: 'SE (Squeeze-and-Excitation) ratio', detail: '0.25 in all MBConv blocks. The SE module first squeezes spatial dimensions via global average pooling, then uses two FC layers to compute channel-wise attention weights.' },
    { label: 'Stochastic depth', detail: 'with linearly increasing drop probability from 0 (early layers) to 0.2-0.3 (final layers) is critical for regularization in larger models.' },
    { label: 'The $\\alpha \\cdot \\beta^2 \\cdot \\gamma^2 \\approx 2$ constraint', detail: 'reflects that FLOPs scale linearly with depth, quadratically with width (both input and output channels), and quadratically with resolution (both spatial dimensions).' },
    { label: 'EfficientNet-B0 vs. ResNet-50', detail: 'B0 achieves 77.1% top-1 (vs. 76.0%) with 5.3M params (vs. 25.6M) and 0.39B FLOPs (vs. 4.1B).' },
    { label: 'Noisy Student Training', detail: '(Xie et al., 2020): Using EfficientNet with semi-supervised learning achieved 88.4% top-1 on ImageNet, demonstrating the architecture\'s capacity when data is scaled.' },
];

export default function ExplorerCVCEfficientnet() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          EfficientNet — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of efficientnet.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
