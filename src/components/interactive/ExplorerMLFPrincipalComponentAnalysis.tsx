import { useState } from 'react';

const DETAILS = [
    { label: 'Time complexity', detail: 'O((nd^2, n^2d)) for full decomposition; randomized SVD achieves O(ndk) for the top k components' },
    { label: 'Centering is essential', detail: 'PCA on uncentered data finds the direction of the mean, not of maximum variance. Always subtract &#123;x&#125; before computing the covariance matrix' },
    { label: 'Scale sensitivity', detail: 'Features with larger scales dominate. Standardize features (zero mean, unit variance) when they are on different scales. Using the correlation matrix instead of the covariance matrix is equivalent to standardizing first' },
    { label: 'Linearity', detail: 'PCA only captures linear relationships. For nonlinear structure, use kernel PCA, t-SNE, or UMAP' },
    { label: 'Reconstruction', detail: 'The original data can be approximately recovered as &#123;X&#125; = ZW^T + &#123;x&#125;, with reconstruction error equal to _&#123;i=k+1&#125;^&#123;d&#125; _i' },
    { label: 'Incremental PCA', detail: 'For datasets too large to fit in memory, incremental PCA processes the data in mini-batches, updating the eigendecomposition as new data arrives. This is available in scikit-learn as IncrementalPCA' },
];

export default function ExplorerMLFPrincipalComponentAnalysis() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Principal Component Analysis \u2014 Key Details Explorer
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
