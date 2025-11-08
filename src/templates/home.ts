import { getCurrentYear } from '../utils/format';
import { NAV_LINKS } from '../constants';
import { i18n, t } from '../i18n';

/**
 * 生成主页 HTML
 */
export function generateHomePage(
	pageType: 'home' | 'error' | 'image' = 'home',
	pageData?: { status: number; message: string } | { imagePath: string },
	request?: Request,
): string {
	const currentYear = getCurrentYear();
	const imagesList = JSON.stringify([]);
	const currentLang = i18n.getCurrentLanguage();

	// 获取当前域名
	const currentDomain = request ? new URL(request.url).origin : '/';

	// 生成导航链接 HTML
	const navLinksHtml = NAV_LINKS.map((link) => {
		const translatedName = t(`nav.${link.name.toLowerCase()}`);
		// 首页链接用本地 /，其它链接保持原样
		const href = link.name.toLowerCase() === 'home' ? '/' : link.url;
		return `<a href="${href}">${translatedName}</a>`;
	}).join('\n      <span>|</span>\n      ');

	// 生成语言切换器
	const supportedLanguages = i18n.getSupportedLanguages();
	const languageSwitcherHtml = `
      <div class="language-switcher">
        ${supportedLanguages
					.map(
						(lang) => `
          <button onclick="switchLanguage('${lang.code}')" class="${currentLang === lang.code ? 'active' : ''}" title="${i18n.getLanguageName(lang.code)}">${lang.nativeName}</button>
        `,
					)
					.join('<span>|</span>')}
      </div>`;

	return `
<!DOCTYPE html>
<html lang="${currentLang === 'zh-CN' ? 'zh' : currentLang === 'ja' ? 'ja' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('pageTitles.home')}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html { scrollbar-gutter: stable; }
    ::-webkit-scrollbar { width: 12px; height: 12px; }
    ::-webkit-scrollbar-track { background: transparent; margin: 0; }
    ::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.3); border-radius: 4px; border: none; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
    ::-webkit-scrollbar-corner { background: transparent; }
    * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) transparent; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
      background: #fafafa; color: #1a1a1a;
      min-height: 100vh; padding: 2rem; line-height: 1.6;
    }
    body.lightbox-open { overflow: hidden; }

    .header { max-width: 1400px; margin: 0 auto 3rem; text-align: center; position: relative; }
    .logo-illustration { width: 150px; height: 150px; margin: 0 auto 2rem; position: relative; }
    .logo-illustration svg { width: 100%; height: 100%; stroke: #1a1a1a; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .logo-illustration .line-anim { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawLine 2s ease-out forwards; }
    @keyframes drawLine { to { stroke-dashoffset: 0; } }

    h1 { font-size: 2.5rem; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 1.5rem; color: #1a1a1a; line-height: 1.2; }

    .nav-links { display: flex; justify-content: center; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .nav-links a { color: #1a1a1a; text-decoration: none; font-size: 0.95rem; font-weight: 400; position: relative; transition: color 0.3s ease; }
    .nav-links a::after { content: ''; position: absolute; width: 0; height: 1px; bottom: -4px; left: 50%; transform: translateX(-50%); background: #1a1a1a; transition: width 0.3s ease; }
    .nav-links a:hover { color: #4a4a4a; }
    .nav-links a:hover::after { width: 100%; }
    .nav-links span { color: #d0d0d0; user-select: none; }

    .language-switcher {
      position: absolute;
      top: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .language-switcher a,
    .language-switcher button {
      color: #1a1a1a;
      text-decoration: none;
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      border: none;
      background: transparent;
      cursor: pointer;
      font-family: 'Segoe UI Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
      font-size: 1rem;
      letter-spacing: 0.02em;
      vertical-align: middle;
    }

    .language-switcher a.active,
    .language-switcher button.active {
      background: #1a1a1a;
      color: #fafafa;
    }

    .language-switcher a:not(.active):hover,
    .language-switcher button:not(.active):hover {
      background: #f0f0f0;
    }

    .language-switcher span {
      color: #d0d0d0;
      user-select: none;
    }

    .gallery { max-width: 1400px; margin: 0 auto; column-count: 4; column-gap: 1rem; }

    /* 错误页面布局 */
    .gallery.error-page {
      column-count: 1;
      display: block;
      text-align: center;
      padding: 2rem 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .gallery.error-page h1 {
      font-size: 4rem;
    }

    .gallery.error-page .error-illustration {
      width: 150px;
      height: 150px;
      margin-bottom: 2rem;
    }

    .gallery.error-page .help-section {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
		.gallery-item { break-inside: avoid; margin-bottom: 1rem; position: relative; overflow: hidden; border-radius: 8px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer; }
    .gallery-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
    .gallery-item img { width: 100%; height: auto; display: block; transition: filter 0.3s ease; opacity: 0; }
    .gallery-item img.loaded { opacity: 1; }
    .gallery-item:hover img { filter: brightness(0.95); }

    .skeleton { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s ease-in-out infinite; z-index: 1; }
    .skeleton.hidden { display: none; }
    @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .image-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); color: white; padding: 1rem 0.75rem 0.75rem; font-size: 0.75rem; opacity: 0; transition: opacity 0.3s ease; word-break: break-all; pointer-events: none; }
    .image-info a { color: white; text-decoration: none; pointer-events: auto; cursor: pointer; }
    .image-info a:hover { color: #ddd; text-decoration: underline; }
     .gallery-item:hover .image-info { opacity: 1; }

    .loading { display: flex; justify-content: center; align-items: center; padding: 3rem; color: #7a7a7a; flex-direction: column; min-height: 200px; width: 100%; column-span: all; text-align: center; }

    /* 错误页面样式 */
    .error-illustration {
      width: 200px;
      height: 200px;
      margin: 0 auto 3rem;
      position: relative;
    }

    .error-illustration svg {
      width: 100%;
      height: 100%;
      stroke: #1a1a1a;
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .error-illustration .line-anim {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawLine 2s ease-out forwards;
    }

    @keyframes drawLine {
      to {
        stroke-dashoffset: 0;
      }
    }

    .gallery h1 {
      font-size: 6rem;
      font-weight: 300;
      letter-spacing: -0.05em;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
      line-height: 1;
      text-align: center;
    }

    .divider {
      width: 60px;
      height: 1px;
      background: #1a1a1a;
      margin: 2rem auto;
    }

    .help-section {
      margin-top: 3rem;
      text-align: left;
      border-left: 4px solid #1a1a1a;
      padding-left: 1.5rem;
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .help-section h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: #1a1a1a;
    }

    .help-section p {
      font-size: 0.95rem;
      color: #4a4a4a;
      line-height: 1.7;
    }

    .help-section .nav-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .help-section .nav-links a {
      color: #1a1a1a;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 400;
      position: relative;
      transition: color 0.3s ease;
    }

    .help-section .nav-links a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -4px;
      left: 50%;
      background: #1a1a1a;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    .help-section .nav-links a:hover::after {
      width: 100%;
    }

    /* 图片详情页面样式 */
    .image-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .image-view img {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 2rem;
    }

    .image-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .image-actions a {
      color: #1a1a1a;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border: 1px solid #1a1a1a;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .image-actions a:hover {
      background: #1a1a1a;
      color: #fafafa;
    }

    .image-actions span {
      color: #d0d0d0;
      user-select: none;
    }

    .copyright { font-family: "Courier New", monospace; margin-top: 4rem; padding: 2rem 2rem 1rem; font-size: 0.85rem; color: #7a7a7a; text-align: center; }
    .copyright a { color: #9a9a9a; text-decoration: none; transition: color 0.3s ease; }
    .copyright a:hover { color: #5a5a5a; }

    .powered-by { font-family: "Courier New", monospace; padding: 0.25rem 2rem; font-size: 0.75rem; color: #9a9a9a; text-align: center; }
    .powered-by a { color: #9a9a9a; text-decoration: none; transition: color 0.3s ease; }
    .powered-by a:hover { color: #5a5a5a; }

    .lightbox { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; pointer-events: none; transition: opacity 0.3s ease; opacity: 0; }
    .lightbox.show { opacity: 1; }
    .lightbox.active { pointer-events: auto; }
    .lightbox img { max-width: 90%; max-height: 90vh; object-fit: contain; }
    .lightbox-close { position: absolute; top: 2rem; right: 2rem; color: white; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgb(255 255 255 / 30%); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50%; border: none; cursor: pointer; transition: all 0.3s ease; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .lightbox-close:hover { background: rgb(255 255 255 / 40%); transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .lightbox-close svg { stroke: white; pointer-events: none; }

    @media (max-width: 1200px) {
      .gallery { column-count: 3; }
      .language-switcher {
        position: relative;
        top: auto;
        right: auto;
        display: flex;
        justify-content: center;
        margin: 1rem 0 0;
        order: 1;
      }

      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .nav-links {
        order: 0;
      }

      .language-switcher {
        order: 1;
      }
    }
    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      .logo-illustration { width: 120px; height: 120px; margin-bottom: 1.5rem; }
      .gallery { column-count: 2; }
      .nav-links { gap: 1rem; }
      .language-switcher {
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .language-switcher button {
        font-size: 0.85rem;
        padding: 0.25rem 0.5rem;
      }

      .language-switcher span {
        display: none;
      }
    }
    @media (max-width: 480px) { .gallery { column-count: 1; } body { padding: 1rem; } }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #fafafa; }
      h1, .nav-links a { color: #fafafa; }
      .nav-links a::after { background: #fafafa; }
      .nav-links a:hover { color: #b0b0b0; }
      .nav-links span { color: #3a3a3a; }
      .logo-illustration svg { stroke: #fafafa; }
      .gallery-item { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      .gallery-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
      .skeleton { background: linear-gradient(90deg,#2a2a2a 25%,#3a3a3a 50%,#2a2a2a 75%); background-size: 200% 100%; }
      .stats, .copyright { color: #7a7a7a; }
      .powered-by { color: #9a9a9a; }
      .powered-by a:hover { color: #c0c0c0; }
      .language-switcher a.active,
      .language-switcher button.active {
        background: #fafafa;
        color: #1a1a1a;
      }

      .language-switcher a:not(.active):hover,
      .language-switcher button:not(.active):hover {
        background: #3a3a3a;
      }

      /* 错误页面暗色主题样式 */
      .gallery h1 {
        color: #fafafa;
      }

      .divider,
      .help-section {
        border-color: #fafafa;
      }

      .error-illustration svg {
        stroke: #fafafa;
      }

      .help-section h3 {
        color: #fafafa;
      }

      .help-section p {
        color: #b0b0b0;
      }

      .help-section .nav-links a {
        color: #fafafa;
      }

      .help-section .nav-links a::after {
        background: #fafafa;
      }

      .help-section .nav-links a:hover {
        color: #b0b0b0;
      }

      .image-actions a {
        color: #fafafa;
        border-color: #fafafa;
      }

      .image-actions a:hover {
        background: #fafafa;
        color: #1a1a1a;
      }

      ::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); }
      ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      * { scrollbar-color: rgba(255,255,255,0.3) transparent; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-illustration">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect class="line-anim" x="40" y="50" width="120" height="100" rx="8" style="animation-delay: 0s;"/>
        <circle class="line-anim" cx="70" cy="85" r="12" style="animation-delay: 0.3s;"/>
        <path class="line-anim" d="M48 130 L70 100 L100 120 L130 90 L152 110 L152 142 Q152 142 152 142 L48 142 Q48 142 48 142 Z" fill="currentColor" opacity="0.1" style="animation-delay: 0.5s;"/>
        <polyline class="line-anim" points="48,130 70,100 100,120 130,90 152,110" style="animation-delay: 0.5s;"/>
      </svg>
    </div>
    <h1>${t('home.title')}</h1>
    <div class="nav-links">
      ${navLinksHtml}
    </div>
    <div class="language-switcher">
      ${supportedLanguages
				.map(
					(lang) => `
        <button onclick="switchLanguage('${lang.code}')" class="${currentLang === lang.code ? 'active' : ''}" title="${i18n.getLanguageName(lang.code)}">${lang.nativeName}</button>
      `,
				)
				.join('<span>|</span>')}
    </div>
    <div class="stats" id="stats"></div>
  </div>

  <div class="gallery ${pageType === 'error' ? 'error-page' : ''}" id="gallery">
    ${
			pageType === 'error' && pageData && 'status' in pageData
				? `<div class="error-illustration">\n        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="2" opacity="0.1"/>\n          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1.5"/>\n          <path d="M70 120 Q100 140 130 120" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>\n          <circle cx="85" cy="95" r="3" fill="currentColor"/>\n          <circle cx="115" cy="95" r="3" fill="currentColor"/>\n          <text x="100" y="165" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">${pageData.status}</text>\n        </svg>\n      </div>\n\n      <h1>${t(`error.titles.${pageData.status}`) || t('error.titles.default')}</h1>\n\n      <div class="divider"></div>\n\n      <div class="help-section">\n        <h3>${t('error.titles.help') || 'Help'}</h3>\n        <p>${t(`error.messages.${pageData.status}`) || t('error.messages.default')}</p>\n      </div>\n\n      <div class="nav-links">\n        <a href="/">${t('error.backToHome')}</a>\n      </div>`
				: `<div class="loading">${t('home.loading')}</div>`
		}
  </div>

  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" onclick="closeLightbox()">
      <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
    <img id="lightbox-img" src="" alt="">
  </div>

  <p class="copyright">${t('footer.copyright', { year: currentYear, author: `<a href="https://ichiyo.in" target="_blank" rel="noopener noreferrer">ichiyo</a>` })}</p>
  <p class="powered-by">${t('footer.poweredBy', { provider: '<a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">Cloudflare</a>' })}</p>
  <p class="powered-by">${t('footer.openSource', { platform: '<a href="https://github.com/1Yie/nexora-img" target="_blank" rel="noopener noreferrer">GitHub</a>' })}</p>

  <script>
    const pageType = "${pageType}";
    const images = ${imagesList};
    const translations = {
      loadingImages: "${t('home.loading')}",
      noImagesFound: "${t('home.noImages')}",
      errorLoading: "Error loading images. Please refresh the page."
    };

    // 页面加载时自动设置 lang cookie（如果没有）
    (function ensureLangCookie() {
      var cookies = document.cookie.split(';').map(function(c){return c.trim();});
      var hasLang = cookies.some(function(c){return c.startsWith('lang=');});
      if (!hasLang) {
        var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        var lang = browserLang.startsWith('zh') ? 'zh-CN' : 'en';
        document.cookie = 'lang=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
        window.location.reload();
      }
    })();

    // 语言切换函数（全局可用）
    function switchLanguage(langCode) {
      document.cookie = 'lang=' + langCode + '; path=/; max-age=31536000; SameSite=Lax';
      window.location.reload();
    }
    window.switchLanguage = switchLanguage;

    // 如果是错误页面，调整gallery样式
    if (pageType === 'error') {
      // 错误页面不需要额外逻辑
    } else {
      // 首页逻辑
      const gallery = document.getElementById('gallery');
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');

      let cursor = null;
      let loading = false;
    let hasMore = true;

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function openLightbox(src) {
      lightboxImg.src = src + '?raw=true';
      lightbox.classList.add('active');
      requestAnimationFrame(() => lightbox.classList.add('show'));
      document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      lightbox.addEventListener('transitionend', function handler() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        lightbox.removeEventListener('transitionend', handler);
      });
      document.body.classList.remove('lightbox-open');
    }

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    async function loadImages() {
      if (loading || !hasMore) return;
      loading = true;
      const loadingDiv = document.querySelector('.loading');
      if (loadingDiv) loadingDiv.textContent = translations.loadingImages;

      try {
        const url = cursor ? \`/api/images?cursor=\${encodeURIComponent(cursor)}\` : '/api/images';
        const response = await fetch(url);
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          if (gallery.querySelector('.loading')) gallery.innerHTML = '';

          data.images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = \`
              <div class="skeleton"></div>
              <img src="/\${img.key}?raw=true" alt="\${img.key}" loading="lazy">
              <div class="image-info">
                <div><a href="/\${img.key}" target="_self" rel="noopener noreferrer">\${img.key}</a></div>
                <div>\${formatSize(img.size)}</div>
              </div>
            \`;

            const imgElement = item.querySelector('img');
            const skeleton = item.querySelector('.skeleton');

            imgElement.addEventListener('load', () => { imgElement.classList.add('loaded'); skeleton.classList.add('hidden'); });
            imgElement.addEventListener('error', () => { skeleton.classList.add('hidden'); imgElement.style.opacity = '1'; });
            imgElement.addEventListener('click', () => { openLightbox('/' + img.key); });

            gallery.appendChild(item);
          });

          cursor = data.cursor;
          hasMore = data.hasMore;
        } else {
          hasMore = false;
          if (gallery.querySelector('.loading')) gallery.innerHTML = '<div class="loading">' + translations.noImagesFound + '</div>';
        }
      } catch (error) {
        console.error('Error loading images:', error);
        const loadingDiv = document.querySelector('.loading');
        if (loadingDiv) loadingDiv.textContent = translations.errorLoading;
      } finally { loading = false; }
    }

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 500) loadImages();
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    });

    loadImages();
    } // 结束首页逻辑的else块
  </script>
</body>
</html>
`;
}
