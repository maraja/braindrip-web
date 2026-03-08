import { useState } from 'react';

const STEPS = [
    { title: '1. Latent Semantic Analysis (LSA)', desc: 'LSA (Deerwester et al., 1990) applies Truncated Singular Value Decomposition (SVD) to the term-document matrix. Given a term-document matrix X of size  x N (vocabulary by documents), SVD decomposes it as:  Where U_k ( x k) contains term-topic associations, S_k (k x k) holds singular values.' },
    { title: '2. Latent Dirichlet Allocation (LDA)', desc: 'LDA (Blei, Pritchard, and Ng, 2003) is the most influential topic model. It defines a fully generative process:  The Generative Story: For each topic k = 1, ..., K: draw a word distribution phi_k ~ Dirichlet(beta) For each document d = 1, ..., N:    a.' },
    { title: '3. Non-negative Matrix Factorization (NMF)', desc: 'NMF (Lee and Seung, 1999, applied to text by Xu et al., 2003) factorizes the term-document matrix X ≈ W * H, where all entries in W (_F or KL divergence.' },
    { title: '4. Neural Topic Models', desc: 'Recent approaches combine the generative framework of LDA with neural network flexibility:  ProdLDA (Srivastava and Sutton, 2017): Replaces LDA\'s Dirichlet prior with a logistic-normal approximation and uses a Variational Autoencoder (VAE) architecture.' },
    { title: '5. Evaluation', desc: 'Topic model evaluation is notoriously difficult because ground truth is rarely available:  Topic coherence (Mimno et al., 2011): Measures whether the top-N words in a topic tend to co-occur in a reference corpus. C_V coherence (Roder et al.' },
    { title: '6. The Number-of-Topics Selection Problem', desc: 'Choosing K (the number of topics) remains an open challenge: Heuristic approaches: Try K = 10, 20, 50, 100 and select based on coherence scores. Hierarchical Dirichlet Process (HDP): A nonparametric extension of LDA that infers K from data, though it tends to produce many small topics.' },
];

export default function WalkthroughNLPTopicModeling() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Topic Modeling \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how topic modeling works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
