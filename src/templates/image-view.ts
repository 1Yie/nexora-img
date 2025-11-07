import { BASE_URL } from '../constants';
import { i18n, t } from '../i18n';

/**
 * 生成图片查看页面 HTML
 */
export function generateImageViewPage(filePath: string): string {
	const currentLang = i18n.getCurrentLanguage();

	return `
<!DOCTYPE html>
<html lang="${currentLang === 'zh-CN' ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('pageTitles.imageView', { fileName: filePath })}</title>
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
      background: #fafafa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .back-link {
      position: fixed;
      top: 2rem;
      left: 2rem;
      color: #1a1a1a;
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      opacity: 1;
      transform: translateY(0);
    }

    .back-link:hover {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .back-link.hidden {
      opacity: 0;
      transform: translateY(calc(-100% - 2rem));
      pointer-events: none;
    }

    .image-container {
      max-width: 95%;
      max-height: 85vh;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      min-width: 300px;
      min-height: 300px;
    }

    .skeleton {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s ease-in-out infinite;
      border-radius: 8px;
      z-index: 1;
    }

    .skeleton.hidden {
      display: none;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    img {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      opacity: 0;
      transition: all 0.3s ease;
      position: relative;
      cursor: zoom-in;
    }

    img.loaded {
      opacity: 1;
    }

    img:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .image-info {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      color: #1a1a1a;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
      max-width: 90%;
      word-break: break-all;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s ease;
      opacity: 1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .image-info:hover {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .image-info:active {
      transform: translateX(-50%) translateY(0) scale(0.98);
    }

    .image-info.hidden {
      opacity: 0;
      transform: translateX(-50%) translateY(calc(100% + 2rem));
      pointer-events: none;
    }

    .tooltip {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #1a1a1a;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      z-index: 1000;
    }

    .tooltip.show {
      opacity: 1;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: rgba(255, 255, 255, 0.6);
    }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; }
      .back-link, .image-info, .tooltip { color: white; background: rgba(50, 50, 50, 0.85); }
      .back-link:hover, .image-info:hover { background: rgba(70, 70, 70, 0.95); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); }
      .tooltip::after { border-top-color: rgba(50, 50, 50, 0.85); }
      img { box-shadow: 0 8px 32px rgba(0,0,0,0.6); }
      .skeleton {
        background: linear-gradient(
          90deg,
          #2a2a2a 25%,
          #3a3a3a 50%,
          #2a2a2a 75%
        );
        background-size: 200% 100%;
      }
      ::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); }
      ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      * { scrollbar-color: rgba(255,255,255,0.3) transparent; }
    }
  </style>
</head>
<body>
  <a href="/" class="back-link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
    ${t('imageView.backToGallery')}
  </a>
  <div class="image-container">
    <div class="skeleton" id="skeleton"></div>
    <img src="/${filePath}?raw=true" alt="${filePath}" id="mainImage">
  </div>
  <div class="image-info" onclick="copyToClipboard()">
    ${filePath}
  </div>
  <div class="tooltip" id="tooltip">Copied!</div>
  <script>
    const mainImage = document.getElementById('mainImage');
    const skeleton = document.getElementById('skeleton');
    const backLink = document.querySelector('.back-link');
    const imageInfo = document.querySelector('.image-info');
    const translations = {
      copied: "${t('imageView.copied')}",
      copyFailed: "${t('imageView.copyFailed')}"
    };

    mainImage.addEventListener('load', () => {
      mainImage.classList.add('loaded');
      skeleton.classList.add('hidden');
    });

    mainImage.addEventListener('error', () => {
      skeleton.classList.add('hidden');
      mainImage.style.opacity = '1';
    });

    // 鼠标悬浮图片时隐藏返回按钮和底部信息
    mainImage.addEventListener('mouseenter', () => {
      backLink.classList.add('hidden');
      imageInfo.classList.add('hidden');
    });

    mainImage.addEventListener('mouseleave', () => {
      backLink.classList.remove('hidden');
      imageInfo.classList.remove('hidden');
    });

    function copyToClipboard() {
      const url = 'https://${BASE_URL}/${filePath}?raw=true';
      const tooltip = document.getElementById('tooltip');
      const imageInfoRect = imageInfo.getBoundingClientRect();

      // 动态计算 tooltip 位置：在 image-info 上方
      const tooltipTop = imageInfoRect.top - tooltip.offsetHeight - 10;
      tooltip.style.bottom = 'auto';
      tooltip.style.top = tooltipTop + 'px';

      navigator.clipboard.writeText(url).then(() => {
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        tooltip.textContent = translations.copyFailed;
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
          tooltip.textContent = translations.copied;
        }, 2000);
      });
    }
  </script>
</body>
</html>
`;
}
