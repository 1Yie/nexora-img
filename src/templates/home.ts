import { getCurrentYear } from "../utils/format";
import { NAV_LINKS } from "../constants";

/**
 * 生成主页 HTML
 */
export function generateHomePage(): string {
  const currentYear = getCurrentYear();
  const imagesList = JSON.stringify([]);

  const navLinksHtml = NAV_LINKS.map((link) => `<a href="${link.url}">${link.name}</a>`).join(
    '\n      <span>|</span>\n      '
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexora</title>
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

    .header { max-width: 1400px; margin: 0 auto 3rem; text-align: center; }
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

    .stats { font-size: 0.9rem; color: #7a7a7a; margin-top: 1rem; text-align: center; }

    .gallery { max-width: 1400px; margin: 0 auto; column-count: 4; column-gap: 1rem; }
    .gallery-item { break-inside: avoid; margin-bottom: 1rem; position: relative; overflow: hidden; border-radius: 8px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s ease; cursor: pointer; }
    .gallery-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateY(-2px); }
    .gallery-item img { width: 100%; height: auto; display: block; transition: opacity 0.3s ease; opacity: 0; }
    .gallery-item img.loaded { opacity: 1; }
    .gallery-item:hover img { opacity: 0.9; }

    .skeleton { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s ease-in-out infinite; z-index: 1; }
    .skeleton.hidden { display: none; }
    @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .image-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); color: white; padding: 1rem 0.75rem 0.75rem; font-size: 0.75rem; opacity: 0; transition: opacity 0.3s ease; word-break: break-all; pointer-events: none; }
    .image-info a { color: white; text-decoration: none; pointer-events: auto; cursor: pointer; }
    .image-info a:hover { color: #ddd; text-decoration: underline; }
    .gallery-item:hover .image-info { opacity: 1; }

    .loading { display: flex; justify-content: center; align-items: center; padding: 3rem; color: #7a7a7a; flex-direction: column; min-height: 200px; width: 100%; column-span: all; text-align: center; }

    .copyright { font-family: "Courier New", monospace; margin-top: 4rem; padding: 2rem 2rem 1rem; font-size: 0.85rem; color: #7a7a7a; text-align: center; }
    .copyright a { color: #9a9a9a; text-decoration: none; transition: color 0.3s ease; }
    .copyright a:hover { color: #5a5a5a; }

    .powered-by { font-family: "Courier New", monospace; padding: 0 2rem 2rem; font-size: 0.75rem; color: #9a9a9a; text-align: center; }
    .powered-by a { color: #9a9a9a; text-decoration: none; transition: color 0.3s ease; }
    .powered-by a:hover { color: #5a5a5a; }

    .lightbox { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; pointer-events: none; transition: opacity 0.3s ease; opacity: 0; }
    .lightbox.show { opacity: 1; }
    .lightbox.active { pointer-events: auto; }
    .lightbox img { max-width: 90%; max-height: 90vh; object-fit: contain; }
    .lightbox-close { position: absolute; top: 2rem; right: 2rem; color: white; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgb(255 255 255 / 30%); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50%; border: none; cursor: pointer; transition: all 0.3s ease; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .lightbox-close:hover { background: rgb(255 255 255 / 40%); transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
    .lightbox-close svg { stroke: white; pointer-events: none; }

    @media (max-width: 1200px) { .gallery { column-count: 3; } }
    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      .logo-illustration { width: 120px; height: 120px; margin-bottom: 1.5rem; }
      .gallery { column-count: 2; }
      .nav-links { gap: 1rem; }
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
    <h1>Nexora - Image Vault</h1>
    <div class="nav-links">
      ${navLinksHtml}
    </div>
    <div class="stats" id="stats"></div>
  </div>

  <div class="gallery" id="gallery">
    <div class="loading">Loading gallery...</div>
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

  <p class="copyright">Copyright © ${currentYear} <a href="https://ichiyo.in/" target="_blank" rel="noopener noreferrer">ichiyo</a></p>
  <p class="powered-by">Powered by <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">Cloudflare</a></p>

  <script>
    const images = ${imagesList};
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
      if (loadingDiv) loadingDiv.textContent = 'Loading images...';

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
          if (gallery.querySelector('.loading')) gallery.innerHTML = '<div class="loading">No images found</div>';
        }
      } catch (error) {
        console.error('Error loading images:', error);
        const loadingDiv = document.querySelector('.loading');
        if (loadingDiv) loadingDiv.textContent = 'Error loading images. Please refresh the page.';
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
  </script>
</body>
</html>
`;
}
