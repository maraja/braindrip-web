import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCPanopticSegmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Look at any photograph. Some regions are countable, distinct objects -- a person, a car, a dog. Computer vision calls these things. Other regions are amorphous, uncountable masses -- sky, road, grass, water. These are stuff.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given C_&#123;th&#125; thing classes and C_&#123;st&#125; stuff classes: Every pixel must receive exactly one label (no overlapping masks, no unlabeled pixels). Thing pixels: assigned a (class, instance\\_id) pair. Stuff pixels: assigned a class label only (all sky pixels share the same label).' },
    { emoji: '🔍', label: 'In Detail', text: 'Panoptic segmentation, introduced by Kirillov et al. (2019), demands a single prediction that labels every pixel with a semantic class and, for thing classes, a unique instance ID. The output is a panoptic map P  &#123;N&#125;^&#123;H x W&#125; where each value encodes both class and instance:' },
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
