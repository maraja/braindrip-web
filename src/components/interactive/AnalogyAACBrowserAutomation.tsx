import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACBrowserAutomation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a research assistant who can physically sit at a computer, open a web browser, navigate to any website, read the content, fill out forms, click buttons, and report back what they find. Browser automation gives an AI agent exactly this capability.' },
    { emoji: '⚙️', label: 'How It Works', text: 'DOM-based tools control a browser programmatically through its Document Object Model. The agent generates code or commands that:  Navigate to a URL (page.goto("https://example.com")) Wait for elements to load (page.waitForSelector(".results")) Extract content (page.textContent(".article-body")) Interact with elements (page.' },
    { emoji: '🔍', label: 'In Detail', text: 'Browser automation for AI agents comes in two fundamental approaches. The DOM-based approach uses tools like Playwright or Puppeteer to programmatically control a headless browser, interacting with the page through its HTML structure — selecting elements by CSS selectors, extracting text content, and triggering click events.' },
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
