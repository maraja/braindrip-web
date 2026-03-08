import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02TheDataQualityRevolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are studying for a medical exam. You could read every page on the internet mentioning medicine — forum posts, ads, conspiracy theories, textbooks all mixed together. Or you could study carefully curated textbooks, peer-reviewed papers, and structured problem sets.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-2 (2019) trained on WebText, 40GB scraped from Reddit outbound links — a rough quality filter based on social upvotes. GPT-3 (2020) scaled to 300B tokens from Common Crawl, WebText2, Books, and Wikipedia, with only light filtering. The prevailing assumption was that neural networks could learn to ignore noise at sufficient scale.' },
    { emoji: '🔍', label: 'In Detail', text: 'Early LLM training took the first approach: scrape the entire web, throw it all in, and trust that scale would average out the noise. The data quality revolution is the field\'s hard-won realization that the second approach — careful curation, filtering, and even synthetic generation of high-quality data — produces dramatically better models, often.' },
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
