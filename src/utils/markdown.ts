// ---------------------------------------------------------------------------
// renderMarkdown -- simple Markdown -> HTML converter
// ---------------------------------------------------------------------------

/**
 * Supported syntax:
 *  - # H1, ## H2, ### H3 headings
 *  - ```python ... ``` fenced code blocks (with syntax highlighting class)
 *  - `inline code`
 *  - **bold** and *italic*
 *  - - bullet lists (unordered)
 *  - 1. 2. 3. numbered lists (ordered)
 *  - Regular paragraphs
 */

// ---- Inline helpers -------------------------------------------------------

/** Escape HTML special characters to prevent XSS. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Process inline formatting: code, bold, italic. */
function processInline(text: string): string {
  // 1. Inline code (`...`) -- must be handled first to protect content
  let result = text.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // 2. Bold (**...**)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 3. Italic (*...*)
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  return result;
}

// ---- Block-level parser ---------------------------------------------------

/**
 * Split markdown into blocks and convert each block to HTML.
 * We process the source line-by-line so that fenced code blocks are
 * handled correctly even when they contain blank lines.
 */
function renderBlocks(md: string): string {
  const lines = md.split('\n');
  const htmlBlocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ---- Fenced code block ----
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      // Skip closing ```
      if (i < lines.length) i += 1;

      const codeContent = escapeHtml(codeLines.join('\n'));
      htmlBlocks.push(
        `<pre class="code-block"><code class="language-${escapeHtml(lang)}">${codeContent}</code></pre>`,
      );
      continue;
    }

    // ---- Headings ----
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length; // 1, 2, or 3
      const content = processInline(headingMatch[2].trim());
      htmlBlocks.push(`<h${level}>${content}</h${level}>`);
      i += 1;
      continue;
    }

    // ---- Unordered list (bullet) ----
    if (line.match(/^\s*[-*+]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*+]\s+/)) {
        const itemText = lines[i].replace(/^\s*[-*+]\s+/, '').trim();
        items.push(`<li>${processInline(itemText)}</li>`);
        i += 1;
      }
      htmlBlocks.push(`<ul>${items.join('\n')}</ul>`);
      continue;
    }

    // ---- Ordered list ----
    if (line.match(/^\s*\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        const itemText = lines[i].replace(/^\s*\d+\.\s+/, '').trim();
        items.push(`<li>${processInline(itemText)}</li>`);
        i += 1;
      }
      htmlBlocks.push(`<ol>${items.join('\n')}</ol>`);
      continue;
    }

    // ---- Blank line ----
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    // ---- Paragraph (collect consecutive non-empty, non-special lines) ----
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      // Stop at blank lines or special block starts
      if (cur.trim() === '') break;
      if (cur.trimStart().startsWith('```')) break;
      if (cur.match(/^#{1,3}\s+/)) break;
      if (cur.match(/^\s*[-*+]\s+/)) break;
      if (cur.match(/^\s*\d+\.\s+/)) break;
      paragraphLines.push(cur.trim());
      i += 1;
    }
    if (paragraphLines.length > 0) {
      htmlBlocks.push(`<p>${processInline(paragraphLines.join(' '))}</p>`);
    }
  }

  return htmlBlocks.join('\n');
}

// ---- Public API -----------------------------------------------------------

/**
 * Convert a Markdown string to safe HTML.
 *
 * @param md - The raw Markdown source.
 * @returns An HTML string ready to be injected via `dangerouslySetInnerHTML`.
 */
export function renderMarkdown(md: string): string {
  if (!md) return '';
  return renderBlocks(md);
}
