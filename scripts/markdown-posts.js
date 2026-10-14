const fs = require('node:fs');
const path = require('node:path');
const katex = require('../vendor/katex/katex.min.js');

const FRONT_MATTER_KEYS = new Set([
  'slug', 'title', 'category', 'date', 'description', 'author', 'featured', 'featuredDescription', 'draft'
]);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function parseFrontMatter(source, filePath) {
  const normalized = source.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n');
  if (!normalized.startsWith('---\n')) throw new Error(`${filePath} must start with a --- metadata block.`);
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) throw new Error(`${filePath} has an unclosed metadata block.`);
  const metadata = {};
  for (const line of normalized.slice(4, end).split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const separator = line.indexOf(':');
    if (separator < 1) throw new Error(`Invalid metadata line in ${filePath}: ${line}`);
    const key = line.slice(0, separator).trim();
    if (!FRONT_MATTER_KEYS.has(key)) throw new Error(`Unsupported metadata key "${key}" in ${filePath}.`);
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    metadata[key] = value;
  }
  return { metadata, body: normalized.slice(end + 5).trim() };
}

function renderMath(expression, displayMode, filePath) {
  try {
    return katex.renderToString(expression.trim(), {
      displayMode,
      throwOnError: true,
      strict: 'warn',
      output: 'html'
    });
  } catch (error) {
    throw new Error(`Invalid formula in ${filePath}: ${error.message}`);
  }
}

function renderInline(source, filePath) {
  const tokens = [];
  const stash = html => {
    const marker = `\u0000${tokens.length}\u0000`;
    tokens.push(html);
    return marker;
  };
  let value = String(source);
  value = value.replace(/`([^`]+)`/g, (match, code) => stash(`<code>${escapeHtml(code)}</code>`));
  value = value.replace(/\$([^$\n]+)\$/g, (match, expression) => stash(renderMath(expression, false, filePath)));
  value = value.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+["']([^"']+)["'])?\)/g, (match, alt, sourcePath, title) => {
    const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : '';
    return stash(`<figure><img src="${escapeHtml(sourcePath)}" alt="${escapeHtml(alt)}" loading="lazy">${caption}</figure>`);
  });
  value = value.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, label, href) => stash(`<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`));
  value = value.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, href) => stash(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`));
  value = escapeHtml(value);
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  value = value.replace(/\u0000(\d+)\u0000/g, (match, index) => tokens[Number(index)]);
  return value;
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
}

function renderMarkdown(body, filePath) {
  const lines = body.split('\n');
  const output = [];
  let index = 0;
  const isBlockStart = line => /^(#{2,3})\s+/.test(line) || /^```/.test(line) || /^\$\$\s*$/.test(line) || /^>/.test(line) || /^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line);

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) code.push(lines[index++]);
      if (index === lines.length) throw new Error(`Unclosed code block in ${filePath}.`);
      index += 1;
      output.push(`<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\$\$\s*$/.test(line)) {
      const formula = [];
      index += 1;
      while (index < lines.length && !/^\$\$\s*$/.test(lines[index])) formula.push(lines[index++]);
      if (index === lines.length) throw new Error(`Unclosed display formula in ${filePath}.`);
      index += 1;
      output.push(`<div class="article-equation">${renderMath(formula.join('\n'), true, filePath)}</div>`);
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      output.push(`<h${level}>${renderInline(heading[2], filePath)}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith('> [!NOTE]')) {
      const note = [];
      index += 1;
      while (index < lines.length && /^>/.test(lines[index])) note.push(lines[index++].replace(/^>\s?/, ''));
      output.push(`<aside class="article-takeaway"><span>提示</span><p>${renderInline(note.join(' '), filePath)}</p></aside>`);
      continue;
    }

    if (/^>/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
      output.push(`<blockquote><p>${renderInline(quote.join(' '), filePath)}</p></blockquote>`);
      continue;
    }

    const listMatch = line.match(/^\s*([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = /\d+\./.test(listMatch[1]);
      const items = [];
      const listPattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*]\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].match(listPattern);
        if (!item) break;
        items.push(`<li>${renderInline(item[1], filePath)}</li>`);
        index += 1;
      }
      output.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }

    if (index + 1 < lines.length && line.includes('|') && isTableDivider(lines[index + 1])) {
      const headers = splitTableRow(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(splitTableRow(lines[index++]));
      output.push(`<div class="article-table-wrap"><table><thead><tr>${headers.map(cell => `<th>${renderInline(cell, filePath)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map((header, column) => `<td>${renderInline(row[column] || '', filePath)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    if (/^---\s*$/.test(line)) {
      output.push('<hr>');
      index += 1;
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index]) && !(index + 1 < lines.length && lines[index].includes('|') && isTableDivider(lines[index + 1])) && !/^---\s*$/.test(lines[index])) {
      paragraph.push(lines[index++].trim());
    }
    const rendered = renderInline(paragraph.join(' '), filePath);
    output.push(rendered.startsWith('<figure>') && rendered.endsWith('</figure>') ? rendered : `<p>${rendered}</p>`);
  }
  return output.join('\n');
}

function loadMarkdownArticles(postDir) {
  if (!fs.existsSync(postDir)) return [];
  return fs.readdirSync(postDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .sort((first, second) => first.name.localeCompare(second.name, 'zh-CN'))
    .map(entry => {
      const filePath = path.join(postDir, entry.name);
      const { metadata, body } = parseFrontMatter(fs.readFileSync(filePath, 'utf8'), filePath);
      if (metadata.draft === true) return null;
      return {
        ...metadata,
        markdownFile: path.relative(path.dirname(postDir), filePath).split(path.sep).join('/'),
        html: renderMarkdown(body, filePath)
      };
    })
    .filter(Boolean);
}

module.exports = { loadMarkdownArticles, renderMarkdown };
