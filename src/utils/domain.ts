/**
 * 域名验证工具
 */

// 允许的域名列表
const ALLOWED_DOMAINS = [
	'ichiyo.in', // 主域名
	'dash.cloudflare.com', // Cloudflare Dashboard
	'localhost', // 本地开发
];

/**
 * 检查域名是否允许访问
 */
export function isAllowedDomain(hostname: string | null): boolean {
	if (!hostname) return false;

	// 检查是否是主域名或特定域名
	if (ALLOWED_DOMAINS.includes(hostname)) {
		return true;
	}

	// 检查是否是 *.ichiyo.in 的子域名
	if (hostname.endsWith('.ichiyo.in')) {
		return true;
	}

	return false;
}

/**
 * 验证 referer 是否允许
 */
export function isRefererAllowed(referer: string | null): boolean {
	if (!referer) return true;

	try {
		const refererHostname = new URL(referer).hostname;
		return isAllowedDomain(refererHostname);
	} catch {
		return false;
	}
}

/**
 * 获取 CORS Origin
 */
export function getCorsOrigin(referer: string | null): string {
	if (!referer) return '*';

	try {
		const refererURL = new URL(referer);
		if (isAllowedDomain(refererURL.hostname)) {
			return refererURL.origin;
		}
	} catch {}

	return '*';
}
