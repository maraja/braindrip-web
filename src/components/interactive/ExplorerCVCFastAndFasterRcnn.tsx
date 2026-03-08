import { useState } from 'react';

const DETAILS = [
    { label: 'Fast R-CNN with VGG-16', detail: '9% mAP on VOC 2007, 19.7% mAP on COCO (no bells and whistles). Training takes ~9.5 hours on a single GPU.' },
    { label: 'Faster R-CNN with VGG-16', detail: '2% mAP on VOC 2007, 21.9% mAP on COCO. Proposal generation takes ~10ms on GPU.' },
    { label: 'RPN recall', detail: '~98% at IoU 0.5 with 300 proposals, rivaling Selective Search with 2,000 proposals.' },
    { label: 'Anchor configuration', detail: 'Original paper uses areas of 128^2, 256^2, 512^2 with ratios 1:1, 1:2, 2:1, yielding 9 anchors per location.' },
    { label: 'RoI Pooling quantization', detail: 'The coordinate rounding in RoI Pooling introduces spatial misalignment. Mask R-CNN later introduced RoI Align with bilinear interpolation to fix this, gaining ~1-2% AP.' },
    { label: 'Speed breakdown', detail: '(Faster R-CNN, VGG-16): backbone ~120ms, RPN ~10ms, RoI head ~70ms, total ~200ms per image.' },
];

export default function ExplorerCVCFastAndFasterRcnn() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Fast R-CNN and Faster R-CNN \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
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
