import { HelpText } from '../types';
import { getCurrentYear } from '../utils/format';
import { NAV_LINKS } from '../constants';
import { i18n, t } from '../i18n';

/**
 * 获取错误页面的帮助文本
 */
function getHelpText(status: number): HelpText {
	const statusStr = String(status);
	switch (statusStr) {
		case '404':
			return {
				title: t('error.titles.404'),
				content: t('error.messages.404'),
			};
		case '403':
			return {
				title: t('error.titles.403'),
				content: t('error.messages.403'),
			};
		case '500':
			return {
				title: t('error.titles.500'),
				content: t('error.messages.500'),
			};
		default:
			return {
				title: t('error.titles.default'),
				content: t('error.messages.default'),
			};
	}
}

/**
 * 获取错误图标 SVG
 */
function getErrorIllustration(status: number): string {
	if (status === 404) {
		return `
      <!-- 404 - Document with X -->
      <rect class="line-anim" x="60" y="40" width="80" height="100" rx="4" style="animation-delay: 0s;"/>
      <line class="line-anim" x1="75" y1="60" x2="125" y2="60" style="animation-delay: 0.3s;"/>
      <line class="line-anim" x1="75" y1="75" x2="115" y2="75" style="animation-delay: 0.4s;"/>
      <line class="line-anim" x1="75" y1="90" x2="125" y2="90" style="animation-delay: 0.5s;"/>
      <line class="line-anim" x1="85" y1="110" x2="115" y2="130" stroke-width="2" style="animation-delay: 0.7s;"/>
      <line class="line-anim" x1="115" y1="110" x2="85" y2="130" stroke-width="2" style="animation-delay: 0.8s;"/>
    `;
	} else if (status === 403) {
		return `
      <!-- 403 - Lock -->
      <rect class="line-anim" x="70" y="95" width="60" height="65" rx="4" style="animation-delay: 0.3s;"/>
      <path class="line-anim" d="M 85 95 L 85 75 Q 85 55 100 55 Q 115 55 115 75 L 115 95" style="animation-delay: 0s;"/>
      <circle class="line-anim" cx="100" cy="120" r="8" style="animation-delay: 0.6s;"/>
      <line class="line-anim" x1="100" y1="128" x2="100" y2="145" style="animation-delay: 0.8s;"/>
    `;
	} else {
		return `
      <!-- 500 - Warning Triangle -->
      <path class="line-anim" d="M 100 40 L 160 150 L 40 150 Z" style="animation-delay: 0s;"/>
      <line class="line-anim" x1="100" y1="80" x2="100" y2="115" stroke-width="2.5" style="animation-delay: 0.5s;"/>
      <circle class="line-anim" cx="100" cy="130" r="4" fill="currentColor" style="animation-delay: 0.8s;"/>
    `;
	}
}

/**
 * 生成错误页面 HTML
 */
export function generateErrorPage(status: number, title: string, lang: string = 'en'): string {
	i18n.setLanguage(lang as any);
	const helpInfo = getHelpText(status);
	const currentYear = getCurrentYear();
	const illustration = getErrorIllustration(status);

	const navLinksHtml = NAV_LINKS.map((link) => `<a href="${link.url}">${link.name}</a>`).join('\n      <span>|</span>\n      ');

	// 语言切换器
	const languageSwitcher = `
    <div class="language-switcher">
      <a href="?lang=en" class="${lang === 'en' ? 'active' : ''}" title="${t('language.switchTo', { language: 'English' })}">EN</a>
      <span>|</span>
      <a href="?lang=zh-CN" class="${lang === 'zh-CN' ? 'active' : ''}" title="${t('language.switchTo', { language: '中文' })}">中文</a>
    </div>`;

	return `
<!DOCTYPE html>
<html lang="${lang === 'zh-CN' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('pageTitles.error')}</title>
  <style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    html {
      scrollbar-gutter: stable;
    }

    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
      margin: 0;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      border: none;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      border: none;
    }

    ::-webkit-scrollbar-corner {
      background: transparent;
    }

    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
      background: #fafafa;
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      width: 100%;
      text-align: center;
      position: relative;
    }

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

    h1 {
      font-size: 6rem;
      font-weight: 300;
      letter-spacing: -0.05em;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
      line-height: 1;
    }

    .divider {
      width: 60px;
      height: 1px;
      background: #1a1a1a;
      margin: 2rem auto;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1rem;
      color: #1a1a1a;
      letter-spacing: 0.02em;
    }

    .help-section {
      margin-top: 3rem;
      text-align: left;
      border-left: 4px solid #1a1a1a;
      padding-left: 1.5rem;
      margin-bottom: 3rem;
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

    .nav-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .nav-links a {
      color: #1a1a1a;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 400;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      transition: width 0.3s ease;
    }

    .nav-links a:hover {
      color: #4a4a4a;
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    .nav-links span {
      color: #d0d0d0;
      user-select: none;
    }

    .copyright {
      font-family: "Courier New", monospace;
      margin-top: 2rem;
      padding-bottom: 0.5rem;
      font-size: 0.85rem;
      color: #7a7a7a;
      text-align: center;
    }

    .powered-by {
      font-family: "Courier New", monospace;
      padding-top: 0.5rem;
      font-size: 0.75rem;
      color: #9a9a9a;
      text-align: center;
    }

    .powered-by a {
      color: #9a9a9a;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .language-switcher {
      position: absolute;
      top: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .language-switcher a {
      color: #1a1a1a;
      text-decoration: none;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .language-switcher a.active {
      background: #1a1a1a;
      color: #fafafa;
    }

    .language-switcher a:not(.active):hover {
      background: #f0f0f0;
    }

    .language-switcher span {
      color: #d0d0d0;
      user-select: none;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 4rem;
      }

      .error-illustration {
        width: 150px;
        height: 150px;
        margin-bottom: 2rem;
      }

      h2 {
        font-size: 1.1rem;
      }

      .language-switcher {
        top: 1rem;
        right: 1rem;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 1rem;
      }
    }

    @media (prefers-color-scheme: dark) {
      body {
        background: #1a1a1a;
        color: #fafafa;
      }

      h1, h2, .help-section h3, .nav-links a {
        color: #fafafa;
      }

      .nav-links a::after {
        background: #fafafa;
      }

      .nav-links a:hover {
        color: #b0b0b0;
      }

      .nav-links span {
        color: #3a3a3a;
      }

      .divider,
      .help-section {
        border-color: #fafafa;
      }

      .error-illustration svg {
        stroke: #fafafa;
      }

      .help-section p {
        color: #b0b0b0;
      }

      .copyright {
        color: #7a7a7a;
      }

      .powered-by {
        color: #9a9a9a;
      }

      .powered-by a:hover {
        color: #c0c0c0;
      }

      .language-switcher a.active {
        background: #fafafa;
        color: #1a1a1a;
      }

      .language-switcher a:not(.active):hover {
        background: #3a3a3a;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-illustration">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        ${illustration}
      </svg>
    </div>

    <h1>${status}</h1>
    <div class="divider"></div>
    <h2>${title}</h2>

    ${languageSwitcher}

    <div class="help-section">
      <h3>${helpInfo.title}</h3>
      <p>${helpInfo.content}</p>
    </div>

    <div class="nav-links">
      ${navLinksHtml}
    </div>

    <p class="copyright">${t('footer.copyright', { year: currentYear, author: '<a href="https://ichiyo.in" target="_blank" rel="noopener noreferrer">ichiyo</a>' })}</p>
    <p class="powered-by">${t('footer.poweredBy', { provider: '<a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">Cloudflare</a>' })}</p>
    <p class="powered-by">${t('footer.openSource', { platform: '<a href="https://github.com/1Yie/nexora-img" target="_blank" rel="noopener noreferrer">GitHub</a>' })}</p>
  </div>
</body>
</html>
`;
}
