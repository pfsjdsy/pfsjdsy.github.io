/* ============================================================
   渲染脚本：列表页 / 文章页 / 归档
   依赖：assets/posts.js 必须先加载
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmtDate(iso) {
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[0] + " 年 " + parseInt(p[1], 10) + " 月 " + parseInt(p[2], 10) + " 日";
  }

  function catOf(key) { return CATS[key] || { label: "其他", cls: "tag-share" }; }

  function tagHtml(key) {
    var c = catOf(key);
    return '<span class="tag ' + c.cls + '">' + esc(c.label) + "</span>";
  }

  function bySlug(slug) {
    for (var i = 0; i < POSTS.length; i++) if (POSTS[i].slug === slug) return POSTS[i];
    return null;
  }

  /* ---------- 顶栏 / 页脚 ---------- */
  var NAV = [
    { href: "index.html",   text: "首页",   key: "home"},
    { href: "finance.html", text: "财务",   key: "fin" },
    { href: "law.html",     text: "法律",   key: "law" }, 
    { href: "tax.html",     text: "税务",   key: "tax" },
    { href: "share.html",   text: "转载",   key: "share" },
    { href: "tools.html",   text: "工具",   key: "tools" },
    { href: "about.html",   text: "关于",   key: "about" }
  ];

  function renderHeader(active) {
    var host = $("#site-header");
    if (!host) return;
    var nav = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.key === active ? ' class="active"' : "") + ">" + n.text + "</a>";
    }).join("");
    host.className = "site-header";
    host.innerHTML =
      '<div class="header-inner">' +
        '<a class="logo" href="index.html">懂点财税法<span class="dot">·</span></a>' +
        '<nav class="nav">' + nav + "</nav>" +
      "</div>";
  }

  function renderFooter() {
    var host = $("#site-footer");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            '<div class="fb-name">懂点财税法</div>' +
            "<p>" + esc(SITE.desc) + "</p>" +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>栏目</h4>" +
            '<a href="finance.html">财务</a><a href="law.html">法律</a><a href="tax.html">税法</a><a href="share.html">转载</a><a href="tools.html">工具</a>' +
          "</div>" +
          '<div class="footer-col">' +
            "<h4>关于</h4>" +
            '<a href="about.html">关于本站</a><a href="about.html#disclaimer">免责声明</a><a href="about.html#contact">联系我</a>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "© " + SITE.year + " 懂点财税法 · 个人学习与分享站点。<br>" +
          "本站内容仅为知识分享，不构成任何专业意见、税务筹划建议或法律意见；具体问题请咨询您的专业顾问。<br>" +
          "如本站转载内容侵犯您的权利，请联系我，我会第一时间处理。" +
        "</div>" +
      "</div>";
  }

  /* ---------- 卡片 ---------- */
  function cardHtml(p) {
    return '<a class="post-card" href="posts/' + esc(p.slug) + '.html">' +
      '<div class="meta">' + tagHtml(p.cat) + "<span>" + fmtDate(p.date) + "</span><span>" + esc(p.read) + "</span></div>" +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="excerpt">' + esc(p.excerpt) + "</p>" +
    "</a>";
  }

  /* ---------- 列表页 ---------- */
  function renderListPage(activeCat) {
    var host = $("#post-list");
    if (!host) return;
    var list = POSTS.filter(function (p) {
      return activeCat === "all" ? true : p.cat === activeCat;
    });
    if (!list.length) {
      host.innerHTML = '<p style="color:#6b7488">这个栏目还没有文章。</p>';
      return;
    }
    // 首页每类最多取前 N 条，由 data-limit 控制
    var lim = parseInt(host.getAttribute("data-limit") || "0", 10);
    if (lim > 0) list = list.slice(0, lim);
    host.innerHTML = list.map(cardHtml).join("");
  }

  /* ---------- 文章页 ---------- */
  function renderArticle() {
    var host = $("#article-root");
    if (!host) return;

    var slug = host.getAttribute("data-slug");
    var p = bySlug(slug);

    if (!p) {
      host.innerHTML = '<div class="article"><div class="article-header"><h1>文章不存在</h1></div>' +
        '<p>你要找的文章可能已经移动或删除。<a href="../index.html">返回首页</a></p></div>';
      return;
    }

    document.title = p.title + " | " + SITE.name;

    var meta =
      "<span>" + fmtDate(p.date) + "</span>" +
      "<span>" + esc(p.read) + "</span>" +
      "<span>" + esc(SITE.author) + "</span>";

    var tagRow = (p.tags || []).map(function (t) {
      return '<span class="tag tag-share" style="margin-right:6px">' + esc(t) + "</span>";
    }).join("");

    var reprintBox = p.reprint
      ? '<div class="reprint-source"><strong>转载说明：</strong>本文转载已获得原作者授权，版权归原作者所有。' +
        "正文内容未作实质性修改，仅作排版适配；如原作者要求撤下，请联系我立即处理。</div>"
      : "";

    var body = $("#article-body-src");
    var bodyHtml = body ? body.innerHTML : '<p style="color:#c0392b">（正文尚未填写）</p>';
    if (body) body.remove();

    host.innerHTML =
      '<article class="article">' +
        '<header class="article-header">' +
          tagHtml(p.cat) +
          "<h1>" + esc(p.title) + "</h1>" +
          '<div class="meta">' + meta + "</div>" +
          (tagRow ? '<div style="margin-top:12px">' + tagRow + "</div>" : "") +
        "</header>" +
        reprintBox +
        '<div class="article-body">' + bodyHtml + "</div>" +
        '<div class="disclaimer">' +
          "<strong>免责声明：</strong>本文为个人学习与知识分享，仅代表个人理解，不构成任何专业意见、税务筹划建议或法律意见，" +
          "亦不构成对特定事项的正式咨询答复。文中所涉准则、法规可能发生修订，请以最新有效文本为准；" +
          "具体事项请结合实际情况咨询具备相应资质的专业人士。" +
        "</div>" +
      "</article>";
  }

  /* ---------- 归档页 ---------- */
  function renderArchive() {
    var host = $("#archive-list");
    if (!host) return;
    var years = {};
    POSTS.forEach(function (p) {
      var y = String(p.date).slice(0, 4);
      (years[y] = years[y] || []).push(p);
    });
    var keys = Object.keys(years).sort().reverse();
    host.innerHTML = keys.map(function (y) {
      var items = years[y].map(function (p) {
        return '<li><span style="color:#6b7488;font-size:13px;margin-right:10px">' +
          String(p.date).slice(5) + "</span>" +
          '<a href="posts/' + esc(p.slug) + '.html">' + esc(p.title) + "</a> " +
          tagHtml(p.cat) + "</li>";
      }).join("");
      return '<h2 style="font-family:var(--serif);font-size:20px;margin:30px 0 14px;color:var(--brand)">' + y + " 年</h2>" +
        '<ul style="list-style:none;padding:0;line-height:2.2">' + items + "</ul>";
    }).join("");
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader(document.body.getAttribute("data-nav") || "home");
    renderFooter();
    renderListPage(document.body.getAttribute("data-cat") || "all");
    renderArticle();
    renderArchive();
  });
})();
