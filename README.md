# 谱见｜工业过程智能感知与分析

这是一个纯静态个人网站，适合部署到 GitHub Pages、Netlify 或 Vercel。

## 文件说明

- `index.html`：首页内容、文章索引、导航与 SEO 信息
- `all-articles.html`：CSDN 与站内原创文章的分类目录，标题链接到独立阅读页
- `articles/` 与根目录独立文章页：64 篇 CSDN 博客的本地阅读页面，保留原文来源与许可标注
- `data/csdn-articles.json`：抓取到的文章元数据与正文归档
- `data/author-articles.json`：站内原创文章清单；新增文章记录后由生成器同步页面
- `scripts/generate-articles.js`：由文章归档重新生成阅读页和首页分类索引
- `style.css`：颜色、字体、布局、响应式样式
- `script.js`：光谱图、峰位开关、代码复制、订阅反馈和移动菜单
- `.nojekyll`：让 GitHub Pages 直接发布静态文件

## 本地预览

在此文件夹中运行任意静态服务器，例如：

```text
python -m http.server 4173
```

然后打开 `http://localhost:4173`。

## 发布到 GitHub Pages

1. 在 GitHub 新建公开仓库。
2. 上传整个网站项目，尤其不要遗漏 `.github/workflows/pages.yml`、`posts/`、`scripts/`、`data/`、`images/` 和 `vendor/`。
3. 打开仓库的 `Settings → Pages`。
4. 在 `Build and deployment → Source` 中选择 `GitHub Actions`。
5. 提交到 `main` 分支后，GitHub 会自动生成博文并发布网站。

如果使用 GitHub Copilot，可以在仓库中打开这些文件，让 Copilot 按文件注释协助修改；修改后提交到 `main` 分支，GitHub Pages 会自动更新。

## 一键发布 Markdown 博文（推荐）

1. 复制 `posts/示例文章.md`，或直接在 `posts/` 中新建一个 `.md` 文件。
2. 填写文件顶部的标题、英文短名、分类、日期和摘要，然后用 Markdown 写正文。
3. 双击根目录的 `一键生成博文.cmd`。它会更新独立文章页、首页索引和全部文章目录，并打开首页。

生成器还会按日期自动更新首页“最近更新”右侧的 3 篇文章；标记为 `featured: true` 的文章继续显示在左侧精选主卡片中，不会在右侧重复出现。

### 在 GitHub 网页中一键生成并发布

1. 在仓库中打开 `posts/`，点击 `Add file → Create new file`，或打开现有 Markdown 后点击铅笔按钮编辑。
2. 写完后点击 `Commit changes`，提交到 `main`。这次提交会自动触发生成和发布。
3. 如果只是想重新生成一次，打开仓库的 `Actions`，选择左侧的“一键生成并发布博文”，点击 `Run workflow → Run workflow`。
4. 等待任务显示绿色对勾；页面会使用新生成的文章、首页目录和“最近更新”板块。

GitHub Actions 只在发布任务中生成网页，不会把生成后的 HTML 再提交回仓库；线上网站会是最新版本。Markdown 原稿和图片仍需先提交到仓库。若文章引用图片，请将图片同时上传到 `images/`。

网站首页提供“在 GitHub 写新博文”入口；每篇由 `posts/*.md` 生成的文章底部提供“在 GitHub 编辑本文”和“查看 Markdown 原稿”。编辑链接固定指向 `iPAM-Lab/Spectra-Sensor` 的 `main` 分支。GitHub 登录账号需要拥有仓库写入权限；否则 GitHub 会提示通过 Fork 和 Pull Request 提交修改。

在 VS Code 中也可以按 `Ctrl+Shift+B`，运行默认任务“一键生成博文”。支持二、三级标题、段落、粗体、斜体、链接、图片、引用、提示框、列表、表格、代码块，以及 `$行内公式$` 和独占一行的 `$$` 公式块。公式由网站内置的 KaTeX 在生成时排版，离线打开也能正常显示。

文章开头示例：

```markdown
---
slug: nir-calibration-basics
title: 近红外模型校准的基本思路
category: theory
date: 2026.10.13
description: 从样本、参考值和光谱关系理解校准模型。
author: 李鱼强
---

这里开始写正文。行内公式写成 `$y=ax+b$`。

$$
\hat{y}=\mathbf{x}^{\mathsf T}\boldsymbol{\beta}
$$

![图片说明](../images/example.svg "图注")
```

`slug` 只能使用小写英文、数字和连字符，并且不能重复。`category` 可用 `theory`、`processing`、`modeling` 或 `notes`。不想发布的文章可在顶部加入 `draft: true`。

## 旧版 JSON 写作方式

原来的写作方式仍然保留：在 `data/author-articles.json` 的 `records` 数组中新增一篇原创文章。`slug` 使用小写英文和连字符且必须唯一；`category` 使用 `theory`、`processing`、`modeling` 或 `notes`。正文块支持 `p`、`h2`、`h3`、`quote`、`note`、`ul` 和 `ol`。`note` 块可用于带标签提示框。示例：

```json
{
	"slug": "nir-calibration-basics",
	"title": "近红外模型校准的基本思路",
	"category": "theory",
	"date": "2026.10.10",
	"description": "从样本、参考值和光谱关系理解校准模型。",
	"author": "李鱼强",
	"body": [
		{ "type": "p", "text": "在这里写文章开篇。" },
		{ "type": "h2", "text": "先明确分析目标" },
		{ "type": "p", "text": "继续写正文内容。" },
		{ "type": "ul", "items": ["第一点", "第二点"] }
	]
}
```

保存后运行生成器：

```text
node scripts/generate-articles.js
```

如果已经手写好独立 HTML 页面，可在记录里设置 `"page": "my-article.html"` 并省略 `body`；生成器只会将该页面加入索引，不会覆盖文件。未设置 `page` 时，脚本会按 `body` 生成 `articles/<slug>.html`。运行后会同步首页分类“更多”菜单、首页公开笔记数量和 `all-articles.html`，不会覆盖 CSDN 归档记录。

要让文章显示在首页“最近更新”精选卡片，在记录里加入 `"featured": true`；同一时间只允许一篇置顶。可用 `featuredDescription` 单独设置卡片摘要；不填时使用文章的 `description`。更换置顶文章时，移除旧记录的 `featured` 字段，再给新文章加上该字段，然后重新运行生成器。
