import { useState } from 'react';

const DETAILS = [
    { label: 'Perplexity (t-SNE)', detail: 'Controls the effective neighborhood size. Low perplexity (5-10) emphasizes very local structure; high perplexity (30-50) incorporates more global context. Results can change qualitatively with different perplexity values. A perplexity of 30 is a common default.' },
    { label: 'n_neighbors (UMAP)', detail: 'Analogous to perplexity. Larger values yield more global structure at the cost of local detail. Default is typically 15.' },
    { label: 'min_dist (UMAP)', detail: 'Controls how tightly points can pack in the embedding. Smaller values create denser clusters; larger values spread them out. Default is 0.1.' },
    { label: 'Pre-reduction with PCA', detail: 'For data with hundreds or thousands of features, reducing to 50-100 dimensions with PCA before applying t-SNE or UMAP dramatically improves speed and often quality. This is standard practice.' },
    { label: 'Reproducibility', detail: 'Both methods are stochastic. Set random seeds and report parameters for reproducibility. Even with fixed seeds, different implementations may yield different results.' },
    { label: 'Barnes-Hut approximation (t-SNE)', detail: 'The naive t-SNE gradient computation is $O(n^2)$. The Barnes-Hut approximation reduces this to $O(n \\log n)$ by grouping distant points, making t-SNE practical for datasets up to ~100K points.' },
];

export default function ExplorerMLFTsneAndUmap() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          t-SNE and UMAP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of t-sne and umap.
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
