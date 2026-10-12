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
2. 上传 `index.html`、`all-articles.html`、`articles/`、根目录独立文章页、`data/`、`style.css`、`script.js`、`.nojekyll` 和 `README.md`。
3. 打开仓库的 `Settings → Pages`。
4. 选择 `Deploy from a branch`、`main` 分支和 `/ (root)` 目录。
5. 保存后等待 GitHub 生成网站地址。

如果使用 GitHub Copilot，可以在仓库中打开这些文件，让 Copilot 按文件注释协助修改；修改后提交到 `main` 分支，GitHub Pages 会自动更新。

## 更新文章页面

在 `data/author-articles.json` 的 `records` 数组中新增一篇原创文章。`slug` 使用小写英文和连字符且必须唯一；`category` 使用 `theory`、`processing`、`modeling` 或 `notes`。正文块支持 `p`、`h2`、`h3`、`quote`、`note`、`ul` 和 `ol`。`note` 块可用于带标签提示框。示例：

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
