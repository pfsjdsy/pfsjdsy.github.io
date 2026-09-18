# 懂点财税法 · 站点使用说明

个人知识分享站点。纯静态，无构建依赖，双击 `index.html` 即可本地预览。

---

## 一、目录结构

```
dongdian-caishuifa/
├── index.html          首页（含首屏 + 最新文章）
├── tax.html            税务栏目
├── law.html            法律栏目
├── finance.html        财务栏目
├── share.html          转载栏目
├── archive.html        全部文章归档
├── about.html          关于 / 免责声明 / 联系方式
├── assets/
│   ├── style.css       全部样式
│   ├── posts.js        ★ 文章数据（加文章改这里）
│   └── main.js         渲染逻辑（一般不用改）
└── posts/
    ├── materiality-basics.html
    ├── small-business-tax-2026.html
    ├── invoice-risk-checklist.html
    ├── contract-review-basics.html
    ├── shared-tax-policy-reading.html
    └── cashflow-ledger-build.html
```

---

## 二、怎么发一篇新文章（两步）

### 第一步：在 `assets/posts.js` 的 `POSTS` 数组**最顶部**加一条

```js
{
  slug: "my-new-post",              // 英文短名，同时是文件名，建议用连字符
  cat: "tax",                       // tax=税务 / law=法律 / fin=财务 / share=转载
  title: "文章标题",
  date: "2026-09-20",
  read: "约 8 分钟",
  excerpt: "一两句话的摘要，会显示在列表页卡片上。",
  tags: ["标签1", "标签2"],
  reprint: false                    // 转载文章写 true，会自动显示版权说明框
},
```

### 第二步：在 `posts/` 目录下新建 `my-new-post.html`

**复制任意一篇现有文章**，改三处：

1. `<title>` 里的标题；
2. `<div id="article-root" data-slug="...">` 里的 `data-slug` → 改成你的 slug；
3. `<div id="article-body-src">` 里的正文 → 换成你自己的内容。

正文里可用的样式类：

| 类名 | 效果 |
|---|---|
| `<h2>` | 带金色左边线的二级标题 |
| `<p>` | 段落 |
| `<ul> / <ol>` | 列表 |
| `<table>` | 自动套用样式，直接写即可 |
| `<blockquote>` | 引用块 |
| `<div class="callout callout-warn">` | 黄色提示框（配 `<span class="callout-title">`） |
| `<div class="callout callout-info">` | 蓝色提示框 |
| `<div class="reprint-source">` | 转载来源说明框 |

模板骨架：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>文章标题 | 懂点财税法</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body data-nav="tax">   <!-- tax/law/fin/share，用于顶栏高亮 -->

<header id="site-header"></header>

<main class="wrap wrap-narrow">
  <div id="article-root" data-slug="my-new-post"></div>

  <div id="article-body-src" hidden>
    <!-- 正文写在这里 -->
    <p>正文……</p>
  </div>
</main>

<footer id="site-footer"></footer>

<script src="../assets/posts.js"></script>
<script src="../assets/main.js"></script>
</body>
</html>
```

> 注意：文章页里的 `../assets/` 路径不能少 `../`。

---

## 三、转载别人文章的正确做法

复制 `posts/shared-tax-policy-reading.html` 作为模板，**必须逐项替换**开头那个
`reprint-source` 框里的五项内容：

1. 原作者姓名
2. 原标题
3. 原载平台与链接
4. 授权情况（谁、什么时候、通过什么方式同意）
5. 修改说明

同时在 `posts.js` 里把 `reprint: true`，文章页会自动加版权说明条。

**不要做**：只写「侵删」、不写原作者、整篇照搬加个来源就算完。

---

## 四、本地预览

```bash
cd dongdian-caishuifa
python -m http.server 8765
```

浏览器打开 http://localhost:8765

> 直接双击 `index.html` 也能看，但用本地服务器更贴近线上真实情况。

---

## 五、上线（让别人能通过网络访问）

### 方案一：GitHub Pages（免费，推荐先跑通）

1. 注册 GitHub 账号；
2. 新建公开仓库，命名 `<你的用户名>.github.io`；
3. 把本目录所有文件推上去：

```bash
cd dongdian-caishuifa
git init
git add .
git commit -m "init: 懂点财税法站点"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git
git push -u origin main
```

4. 等 1～2 分钟，访问 `https://<你的用户名>.github.io`。

### 方案二：国内访问更稳的选择

| 平台 | 说明 |
|---|---|
| Gitee Pages（码云） | 国内节点，速度快，需实名 |
| 腾讯云 EdgeOne Pages | 免费额度，国内节点 |
| 阿里云 OSS 静态托管 | 稳定，成本低 |

> 国内服务器 + 自有域名需要 **ICP 备案**；用 GitHub / Gitee Pages 的默认域名不需要。

---

## 六、上线前必做的三件事

1. **替换 `about.html` 里的联系邮箱**（目前是占位文字），这是处理版权投诉的唯一通道，必须真实有效；
2. **检查转载文章的授权信息**是否填完整，不要留「请填写」字样；
3. **通读免责声明**，确认表述符合你的实际情况（页脚和文章页各有一处）。

---

## 七、免责声明要点（已内置在页面中）

- 站内内容为个人学习分享，不构成专业意见、税务筹划建议或法律意见；
- 不建立专业服务关系；
- 法规有时效性，以最新有效文本为准；
- 经验数值属实务惯例，非准则强制规定；
- 不涉及任何客户信息；
- 不提供个案筹划建议。

如需修改，页脚文案在 `assets/main.js` 的 `renderFooter()` 里；
文章页免责块也在 `main.js` 的 `renderArticle()` 里；关于页单独在 `about.html`。
