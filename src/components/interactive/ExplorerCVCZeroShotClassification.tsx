import { useState } from 'react';

const DETAILS = [
    { label: 'ImageNet zero-shot benchmarks', detail: '(top-1 accuracy): CLIP ViT-L/14@336px: 76.2%; OpenCLIP ViT-G/14: 80.1%; SigLIP ViT-SO400M: 83.1%; EVA-CLIP ViT-18B: 83.8%' },
    { label: 'Domain sensitivity', detail: 'Zero-shot accuracy drops sharply on specialized domains -- CLIP achieves 76.2% on ImageNet but only 58.8% on EuroSAT (satellite) and 43.3% on DTD (textures)' },
    { label: 'Few-shot hybrid', detail: 'Adding even 1-4 labeled examples per class (few-shot) via linear probing or adapter tuning often boosts accuracy by 10-20 points over pure zero-shot' },
    { label: 'Compute at inference', detail: 'Zero-shot classification requires only one forward pass per image plus precomputed text embeddings, making it faster than ensemble methods' },
    { label: 'Label granularity', detail: 'Performance degrades with fine-grained classes; zero-shot distinguishing dog breeds (Stanford Dogs) is much harder than distinguishing broad categories (CIFAR-10)' },
    { label: 'Embedding normalization', detail: 'Both image and text embeddings must be L2-normalized before similarity computation; skipping this degrades accuracy by 10+ points' },
];

export default function ExplorerCVCZeroShotClassification() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Zero-Shot Classification \u2014 Key Details Explorer
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
