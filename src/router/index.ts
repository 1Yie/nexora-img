import { Env } from '../types';
import { BASE_URL } from '../constants';
import { isRefererAllowed } from '../utils/domain';
import { handleHome } from '../handlers/home';
import { handleApiImages } from '../handlers/api';
import { handleImageRequest } from '../handlers/image';
import { i18n } from '../i18n';

/**
 * 路由处理主函数
 */
export async function handleRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	const referer = request.headers.get('referer');

	// 只检测 cookie 语言，保证切换后立即生效
	i18n.detectLanguageFromCookie(request);

	// 检查域名（生产环境才检查，本地开发跳过）
	const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
	if (!isLocalhost && url.host !== BASE_URL) {
		return handleHome('error', { status: 404, message: 'Not Found' }, request);
	}

	// 处理 API 请求 - 分页获取图片列表
	if (url.pathname === '/api/images') {
		return handleApiImages(request, env);
	}

	// 处理根路径，显示主页
	if (url.pathname === '/' || url.pathname === '') {
		return handleHome('home', undefined, request);
	}

	// 处理图片文件请求
	const filePath = url.pathname.replace(/^\//, '');
	if (filePath) {
		// 检查是否是raw图片请求
		const isRawRequest = url.searchParams.get('raw') === 'true';
		if (isRawRequest) {
			// raw请求仍然直接返回图片
			return handleImageRequest(request, env, filePath);
		} else {
			// 先检查图片是否存在
			try {
				// 尝试获取图片信息来验证是否存在
				const object = await env.R2_IMG.get(filePath);
				if (!object) {
					// 图片不存在，返回404错误
					return handleHome('error', { status: 404, message: 'Not Found' }, request);
				}
				// 图片存在，检查 referer（只对图片详情页检查）
				if (!isRefererAllowed(referer)) {
					console.log(`Unauthorized referer: ${referer}`);
					return handleHome('error', { status: 403, message: 'Forbidden' }, request);
				}
				// 显示图片详情页面
				return handleHome('image', { imagePath: filePath }, request);
			} catch (error) {
				// 发生异常，返回404错误
				return handleHome('error', { status: 404, message: 'Not Found' }, request);
			}
		}
	}

	// 默认返回404错误
	return handleHome('error', { status: 404, message: 'Not Found' }, request);
}
