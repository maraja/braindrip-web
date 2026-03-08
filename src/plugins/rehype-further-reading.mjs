/**
 * Rehype plugin that enhances the "Further Reading" and "Connections to Other Concepts" sections:
 * 1. Auto-links arXiv IDs (e.g., arXiv:2309.17453) to arxiv.org
 * 2. Auto-links paper titles in quotes to Google Scholar search
 * 3. Wraps both sections in styled containers
 */
import { visit } from 'unist-util-visit';

function getTextContent(node) {
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}

function findAndWrapSection(children, matchFn, className) {
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === 'element' && node.tagName === 'h2') {
      const text = getTextContent(node).trim().toLowerCase();
      if (matchFn(text)) {
        let sectionEnd = children.length;
        for (let j = i + 1; j < children.length; j++) {
          if (children[j].type === 'element' && children[j].tagName === 'h2') {
            sectionEnd = j;
            break;
          }
        }

        // Wrap section content in a styled div
        const sectionNodes = children.splice(i + 1, sectionEnd - i - 1);
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: { className: [className] },
          children: sectionNodes,
        };
        children.splice(i + 1, 0, wrapper);
        return { start: i, wrapper };
      }
    }
  }
  return null;
}

export function rehypeFurtherReading() {
  return function (tree) {
    const children = tree.children;

    // Wrap "Connections to Other Concepts" section
    findAndWrapSection(children,
      t => t.includes('connections to other'),
      'connections-section'
    );

    // Find and wrap "Further Reading" section
    const fr = findAndWrapSection(children,
      t => t.includes('further reading') || t === 'references',
      'further-reading-section'
    );

    // Process list items in Further Reading section to add paper links
    if (fr) {
      visit(fr.wrapper, 'element', (node) => {
        if (node.tagName === 'ul' || node.tagName === 'ol') {
          processListItems(node);
        }
      });
    }
  };
}

function processListItems(listNode) {
  visit(listNode, 'element', (li) => {
    if (li.tagName !== 'li') return;

    const fullText = getTextContent(li);

    // 1. Try to extract arXiv ID and add link
    const arxivMatch = fullText.match(/arXiv[:\s]*(\d{4}\.\d{4,5})/i);

    // 2. Try to extract paper title (text in quotes)
    const titleMatch = fullText.match(/"([^"]{10,})"/);
    // Also try with smart quotes
    const smartTitleMatch = fullText.match(/\u201C([^\u201D]{10,})\u201D/);
    const paperTitle = titleMatch?.[1] || smartTitleMatch?.[1];

    if (arxivMatch || paperTitle) {
      // Build the link URL
      let href;
      if (arxivMatch) {
        href = `https://arxiv.org/abs/${arxivMatch[1]}`;
      } else if (paperTitle) {
        href = `https://scholar.google.com/scholar?q=${encodeURIComponent(paperTitle)}`;
      }

      // Add a link icon/button at the end of the li children
      if (href) {
        li.children.push({
          type: 'text',
          value: ' ',
        });
        li.children.push({
          type: 'element',
          tagName: 'a',
          properties: {
            href,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: ['paper-link'],
            title: arxivMatch ? `View on arXiv` : `Search on Google Scholar`,
          },
          children: [
            {
              type: 'text',
              value: arxivMatch ? '[arXiv]' : '[Scholar]',
            },
          ],
        });
      }
    }
  });
}
