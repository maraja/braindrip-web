import { useState } from 'react';

const DETAILS = [
    { label: 'COCO Captions benchmark', detail: 'Standard evaluation uses 5,000 test images with 5 human captions each; CIDEr is the primary metric (human performance ~85 CIDEr on Karpathy test split)' },
    { label: 'CIDEr score progression', detail: 'Show-Tell (2015): 94.3; BLIP (2022): 136.7; BLIP-2 (2023): 145.8; modern multimodal LLMs are less frequently evaluated on CIDEr due to their verbose style' },
    { label: 'Decoding strategies', detail: 'Beam search (beam width 3-5) typically outperforms greedy decoding by 2-5 CIDEr points; nucleus sampling ($p = 0.9$) is preferred for diverse or creative captions' },
    { label: 'Training data', detail: 'COCO Captions (590K pairs), Visual Genome (5.4M region descriptions), CC3M/CC12M (web-crawled), LAION-COCO (600M synthetic)' },
    { label: 'Hallucination rate', detail: 'Captioning models frequently hallucinate objects not present in the image; CHAIR (Caption Hallucination Assessment with Image Relevance) measures this at 7-15% for modern models' },
    { label: 'Resolution matters', detail: 'LLaVA-1.5 at 336px significantly outperforms 224px; some models now support up to 1344px for detail-dense images' },
];

export default function ExplorerCVCImageCaptioning() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Image Captioning — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of image captioning.
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
