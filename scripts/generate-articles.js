const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const archivePath = path.join(dataDir, 'csdn-articles.json');
const authorArchivePath = path.join(dataDir, 'author-articles.json');
const tempExportPath = path.join(root, 'csdn-export.json');
const exportPath = fs.existsSync(tempExportPath) ? tempExportPath : archivePath;
const articleDir = path.join(root, 'articles');
const indexPath = path.join(root, 'index.html');
const directoryPath = path.join(root, 'all-articles.html');

const existingPages = {
  'author-paper-contrastive-spectra': 'paper-contrastive-spectra.html',
  132507146: 'theory-near-infrared.html',
  132507147: 'theory-wide-bands.html',
  132507149: 'theory-diffuse-reflectance.html',
  152891560: 'baseline-correction.html',
  132507155: 'pretreatment-types.html',
  132507153: 'outlier-samples.html',
  124796310: 'spa-feature-selection.html',
  95885517: 'quant-analysis-metrics.html',
  156603601: 'tim-journal.html'
};

const categories = [
  { id: 'theory', label: '01 / 基础理论' },
  { id: 'processing', label: '02 / 数据处理' },
  { id: 'modeling', label: '03 / 建模与论文' },
  { id: 'notes', label: '04 / 学习随记' }
];

function classify(title) {
  if (/MathType|心理|文学阅读|求学心得|学习成长|Python学习|写作内容|人生第一篇/.test(title)) return 'notes';
  if (/基线|预处理|异常样本|样本的划分|数据分析流程|数据正态|正态分布|混淆矩阵|Gaussian noise/.test(title)) return 'processing';
  if (/近红外|光谱|化学计量学|统计学|氢键|分子振动/.test(title)) {
    if (/特征选择|特征提取|建模|模型|定量|算法|期刊|论文|机器学习|统计学|统计指标|数据分析难点|统计/.test(title)) return 'modeling';
    return 'theory';
  }
  if (/MATLAB|Python|MATLAB中|MATLAB读取/.test(title)) return 'notes';
  return 'modeling';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function relativeTarget(pagePath, targetPath) {
  const from = path.dirname(pagePath);
  return path.relative(from, targetPath).split(path.sep).join('/') || path.basename(targetPath);
}

function replaceElementText(html, tagName, id, value) {
  const pattern = new RegExp(`(<${tagName}\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</${tagName}>)`);
  if (!pattern.test(html)) throw new Error(`Featured card element #${id} is missing from index.html.`);
  return html.replace(pattern, (match, openingTag, closingTag) => `${openingTag}${escapeHtml(value)}${closingTag}`);
}

function replaceElementHref(html, id, href) {
  const pattern = new RegExp(`(<a\\b[^>]*\\bid="${id}"[^>]*\\bhref=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`Featured card link #${id} is missing from index.html.`);
  return html.replace(pattern, (match, beforeHref, afterHref) => `${beforeHref}${escapeHtml(href)}${afterHref}`);
}

function renderAuthorBody(blocks, slug) {
  if (!Array.isArray(blocks)) throw new Error(`Article ${slug} must have a body array.`);
  return blocks.map((block, index) => {
    const text = escapeHtml(block.text || '');
    if (block.type === 'p') return `<p>${text}</p>`;
    if (block.type === 'h2' || block.type === 'h3') return `<${block.type}>${text}</${block.type}>`;
    if (block.type === 'quote') return `<blockquote><p>${text}</p></blockquote>`;
    if (block.type === 'note') return `<aside class="article-takeaway"><span>${escapeHtml(block.label || '提示')}</span><p>${text}</p></aside>`;
    if (block.type === 'ul' || block.type === 'ol') {
      if (!Array.isArray(block.items)) throw new Error(`List block ${index + 1} in ${slug} must have an items array.`);
      return `<${block.type}>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</${block.type}>`;
    }
    throw new Error(`Unsupported body block type in ${slug}: ${block.type}`);
  }).join('\n');
}

const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
if (exportData.records.length !== exportData.total || exportData.failures.length) {
  throw new Error(`Incomplete scrape: ${exportData.records.length}/${exportData.total}; failures=${exportData.failures.length}`);
}

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(articleDir, { recursive: true });
if (!fs.existsSync(authorArchivePath)) fs.writeFileSync(authorArchivePath, JSON.stringify({ records: [] }, null, 2) + '\n', 'utf8');
const authorData = JSON.parse(fs.readFileSync(authorArchivePath, 'utf8'));
if (!Array.isArray(authorData.records)) throw new Error('data/author-articles.json must contain a records array.');
const authorSlugs = new Set();
const authorRecords = authorData.records.map(article => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '')) throw new Error(`Invalid author article slug: ${article.slug}`);
  if (authorSlugs.has(article.slug)) throw new Error(`Duplicate author article slug: ${article.slug}`);
  authorSlugs.add(article.slug);
  if (!article.title || !categories.some(category => category.id === article.category)) {
    throw new Error(`Author article ${article.slug} needs a title and a valid category.`);
  }
  if (article.page) {
    const pagePath = path.resolve(root, article.page);
    if (path.extname(pagePath).toLowerCase() !== '.html' || !pagePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(pagePath)) {
      throw new Error(`Author article ${article.slug} points to a missing or invalid HTML page: ${article.page}`);
    }
  }
  return {
    ...article,
    id: `author-${article.slug}`,
    source: 'author',
    date: article.date || new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
    description: article.description || `${article.title}，李鱼强的原创文章。`,
    html: article.page ? null : renderAuthorBody(article.body, article.slug)
  };
});
const records = [
  ...exportData.records.map(article => ({ ...article, source: 'csdn' })),
  ...authorRecords
];
const featuredRecords = records.filter(record => record.featured === true);
if (featuredRecords.length > 1) throw new Error('Only one article can be marked featured.');
const groups = Object.fromEntries(categories.map(category => [category.id, []]));

for (const record of records) {
  const categoryId = record.category || classify(record.title);
  const fileName = existingPages[record.id] || `${record.source === 'author' ? record.slug : record.id}.html`;
  const existingAuthorPage = record.source === 'author' && record.page ? path.resolve(root, record.page) : null;
  const pagePath = existingAuthorPage || (existingPages[record.id] ? path.join(root, fileName) : path.join(articleDir, fileName));
  const indexPathFromArticle = relativeTarget(pagePath, indexPath);
  const category = categories.find(item => item.id === categoryId);
  const title = escapeHtml(record.title);
  const description = escapeHtml(record.description || `${record.title}，作者的一篇 CSDN 原创博客。`);
  const body = record.html || '<p>原文页面正文为空。</p>';
  const source = record.source === 'author'
    ? `<p class="article-source">原创文章 · 作者：${escapeHtml(record.author || '李鱼强')}</p>`
    : `<p class="article-source">原文作者：<a href="${escapeHtml(record.url)}" target="_blank" rel="noreferrer">一条大咸咸鱼 · CSDN 原文</a>${record.license ? `。许可：<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>` : ''}。</p>`;
  const document = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}｜谱见</title>
  <meta name="description" content="${description}">
  <meta name="author" content="李鱼强">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+SC:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${relativeTarget(pagePath, path.join(root, 'style.css'))}">
</head>
<body>
  <div class="page-shell">
    <header class="site-header article-site-header">
      <a class="brand" href="${indexPathFromArticle}#top"><span class="brand-mark"><i></i><i></i><i></i><i></i><i></i></span><span>谱见 <small>SPECTRA NOTES</small></span></a>
      <a class="article-home-link" href="${indexPathFromArticle}#blog-index">← 返回博客索引</a>
    </header>
    <main class="article-page">
      <article class="article-reader">
        <header class="article-reader-header">
          <p class="eyebrow">/ ${escapeHtml(category.label)} · ${escapeHtml(record.date || '博客笔记')}</p>
          <h1>${title}</h1>
          <p class="article-deck">${description}</p>
          <div class="article-meta"><span>${escapeHtml(record.author || '一条大咸咸鱼')}</span><span>${escapeHtml(record.date || '')}</span></div>
        </header>
        <div class="article-body">${body}</div>
        ${source}
        <a class="article-back-link" href="${indexPathFromArticle}#blog-index">← 返回博客索引</a>
      </article>
    </main>
    <footer class="site-footer article-site-footer">
      <a class="brand" href="${indexPathFromArticle}#top"><span class="brand-mark"><i></i><i></i><i></i><i></i><i></i></span><span>谱见 <small>SPECTRA NOTES</small></span></a>
      <p>© 2026 Li Yuqiang. Built with curiosity.</p>
      <div class="footer-links"><a href="${indexPathFromArticle}#blog-index">博客索引</a></div>
    </footer>
  </div>
</body>
</html>
`;

  if (!existingAuthorPage) fs.writeFileSync(pagePath, document, 'utf8');
  groups[categoryId].push({ title: record.title, href: relativeTarget(indexPath, pagePath), date: record.date, id: record.id });
}

const index = fs.readFileSync(indexPath, 'utf8');
const start = '<!-- AUTO_ARTICLE_INDEX_START -->';
const end = '<!-- AUTO_ARTICLE_INDEX_END -->';
const startAt = index.indexOf(start);
const endAt = index.indexOf(end);
if (startAt < 0 || endAt < startAt) throw new Error('Article index markers are missing.');
for (const category of categories) {
  groups[category.id].sort((first, second) => Date.parse(second.date.replaceAll('.', '-')) - Date.parse(first.date.replaceAll('.', '-')));
}
const directorySections = categories.map(category => {
  const entries = groups[category.id].map(article => `          <li><a href="${escapeHtml(article.href)}">${escapeHtml(article.title)}</a><time>${escapeHtml(article.date)}</time></li>`).join('\n');
  return `      <section class="archive-category" id="${escapeHtml(category.id)}">\n        <header class="archive-category-heading"><h2>${escapeHtml(category.label)}</h2><span>${groups[category.id].length} 篇</span></header>\n        <ol class="archive-list">\n${entries}\n        </ol>\n      </section>`;
}).join('\n');
const directoryDocument = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>全部文章｜谱见</title>
  <meta name="description" content="按基础理论、数据处理、建模与论文、学习随记分类浏览全部博客文章。">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+SC:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="page-shell">
    <header class="site-header article-site-header">
      <a class="brand" href="index.html#top"><span class="brand-mark"><i></i><i></i><i></i><i></i><i></i></span><span>谱见 <small>SPECTRA NOTES</small></span></a>
      <a class="article-home-link" href="index.html#blog-index">← 返回首页</a>
    </header>
    <main class="archive-page">
      <div class="archive-inner">
        <header class="archive-heading"><p class="eyebrow">/ 全部文章 · ${records.length} 篇</p><h1>按主题浏览</h1><p>选择标题，进入对应文章的独立阅读页。</p></header>
${directorySections}
      </div>
    </main>
    <footer class="site-footer article-site-footer"><a class="brand" href="index.html#top"><span class="brand-mark"><i></i><i></i><i></i><i></i><i></i></span><span>谱见 <small>SPECTRA NOTES</small></span></a><p>© 2026 Li Yuqiang. Built with curiosity.</p><div class="footer-links"><a href="index.html#blog-index">首页索引</a></div></footer>
  </div>
</body>
</html>
`;
fs.writeFileSync(directoryPath, directoryDocument, 'utf8');
const markup = `<div class="index-grid">\n${categories.map(category => {
  const articles = groups[category.id];
  const latest = articles.slice(0, 3).map(article => `        <a href="${escapeHtml(article.href)}">${escapeHtml(article.title)} <span>→</span></a>`).join('\n');
  const older = articles.slice(3);
  const more = older.length
    ? `\n        <details class="index-more"><summary>更多</summary><div class="index-more-links">\n${older.map(article => `          <a href="${escapeHtml(article.href)}">${escapeHtml(article.title)} <span>→</span></a>`).join('\n')}\n        </div></details>`
    : '';
  return `    <div class="index-column">\n      <div class="index-heading"><p class="index-label">${escapeHtml(category.label)}</p>${more}\n      </div>\n${latest}\n    </div>`;
}).join('\n')}\n  </div>`;
const updatedIndex = index.slice(0, startAt + start.length) + '\n          ' + markup.replaceAll('\n', '\n          ') + '\n          ' + index.slice(endAt);
let indexWithFeatured = updatedIndex;
if (featuredRecords.length === 1) {
  const featured = featuredRecords[0];
  const categoryId = featured.category || classify(featured.title);
  const entry = groups[categoryId].find(article => article.id === featured.id);
  if (!entry) throw new Error(`Featured article was not added to category ${categoryId}.`);
  indexWithFeatured = replaceElementText(indexWithFeatured, 'p', 'featuredArticleTag', `精选更新 · ${featured.date || ''}`);
  indexWithFeatured = replaceElementText(indexWithFeatured, 'h3', 'featuredArticleTitle', featured.title);
  indexWithFeatured = replaceElementText(indexWithFeatured, 'p', 'featuredArticleDescription', featured.featuredDescription || featured.description || '');
  indexWithFeatured = replaceElementHref(indexWithFeatured, 'featuredArticleLink', entry.href);
}
const publicArticleCountPattern = /(<b id="publicArticleCount">)\d+(<\/b>)/;
if (!publicArticleCountPattern.test(indexWithFeatured)) throw new Error('Public article count marker is missing from index.html.');
const indexWithUpdatedCount = indexWithFeatured.replace(publicArticleCountPattern, (match, before, after) => `${before}${records.length}${after}`);
fs.writeFileSync(indexPath, indexWithUpdatedCount, 'utf8');

if (exportPath === tempExportPath) fs.renameSync(tempExportPath, archivePath);
console.log(JSON.stringify({ generated: records.length, csdn: exportData.records.length, original: authorRecords.length, categories: Object.fromEntries(categories.map(category => [category.label, groups[category.id].length])), archive: path.relative(root, archivePath), authorArchive: path.relative(root, authorArchivePath) }, null, 2));
