import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCFrequencyDomainAndFourierTransform() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider a music equalizer on a stereo system. The raw audio signal is a complex waveform in the time domain, but the equalizer breaks it into separate frequency bands -- bass, midrange, treble -- so you can boost or cut each independently. The Fourier transform does the same thing for images, except now you have a 2D signal.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The naive DFT requires O(M^2 N^2) operations. The Fast Fourier Transform (Cooley-Tukey, 1965) exploits symmetry and periodicity to reduce this to O(MN (MN)), making practical computation possible. For a 1024x1024 image, this is the difference between ~10^&#123;12&#125; and ~2 x 10^7 operations.' },
    { emoji: '🔍', label: 'In Detail', text: 'Mathematically, the 2D Discrete Fourier Transform (DFT) converts an M x N image I[m, n] into a complex-valued frequency representation F[u, v]:' },
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
