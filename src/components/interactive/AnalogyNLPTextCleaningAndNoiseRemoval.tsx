import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPTextCleaningAndNoiseRemoval() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to read a water-damaged book where some pages are smudged, others are printed in different fonts, and several pages from entirely different books have been bound in by mistake. Before you can study the content, you must identify and repair the damage.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Web-scraped text contains HTML tags, CSS, JavaScript, and navigation elements that are noise for NLP:  Key considerations: Entity decoding: &amp; to &, &lt; to &lt;, &#8212; to em-dash. Use BeautifulSoup or html.unescape(). Structural information: &lt;p&gt; tags indicate paragraph breaks; &lt;h1&gt; tags indicate section titles.' },
    { emoji: '🔍', label: 'In Detail', text: 'Unlike text-normalization.md, which standardizes legitimate surface variation (case, Unicode forms), text cleaning addresses corruption and noise -- characters that should not be there at all, or that arrived in the wrong encoding, or that represent non-textual artifacts.' },
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
