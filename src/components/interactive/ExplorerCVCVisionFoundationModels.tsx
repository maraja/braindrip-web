import { useState } from 'react';

const DETAILS = [
    { label: 'Backbone architecture', detail: 'ViT is the universal backbone; CNNs have been largely displaced for foundation models due to ViT\'s scalability and compatibility with self-supervised objectives' },
    { label: 'Patch size trade-off', detail: '14x14 patches are standard; 16x16 is slightly faster but loses resolution; some models offer both (DINOv2 ViT-B/14 vs ViT-B/16)' },
    { label: 'Feature extraction points', detail: 'CLS token for global features (classification, retrieval); patch tokens for dense prediction (segmentation, depth); both are useful' },
    { label: 'Transfer benchmarks', detail: 'ImageNet (classification), ADE20K (segmentation), NYUv2 (depth), COCO (detection), VTAB (diverse vision tasks)' },
    { label: 'Linear probe vs fine-tune gap', detail: 'For DINOv2 ViT-g, the gap is ~2-3% on ImageNet (86.3% linear vs ~89% fine-tuned), indicating features are nearly task-ready out of the box' },
    { label: 'Inference speed', detail: 'DINOv2 ViT-B/14 processes ~150 images/sec on A100 at 518px; ViT-g/14 at ~30 images/sec' },
];

export default function ExplorerCVCVisionFoundationModels() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Vision Foundation Models — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of vision foundation models.
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
