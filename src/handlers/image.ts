import { Env } from '../types';
import { getCorsOrigin } from '../utils/domain';
import { CACHE_CONTROL } from '../constants';
import { generateImageViewPage } from '../templates/image-view';
import { generateErrorPage } from '../templates/error';

/**
 * 处理图片文件请求
 */
export async function handleImageRequest(request: Request, env: Env, filePath: string): Promise<Response> {
	const url = new URL(request.url);
	const referer = request.headers.get('referer');
	const isRawRequest = url.searchParams.get('raw') === 'true';

	try {
		const object = await env.R2_IMG.get(filePath);

		if (!object) {
			console.log(`File not found: ${filePath}`);
			return new Response(generateErrorPage(404, 'Not Found'), {
				status: 404,
				headers: {
					'Content-Type': 'text/html; charset=utf-8',
					'Cache-Control': CACHE_CONTROL.NO_CACHE,
				},
			});
		}

		// raw=true → 返回原图 + 长缓存
		if (isRawRequest) {
			const headers = new Headers();
			headers.set('Content-Type', object.httpMetadata?.contentType || 'image/webp');
			headers.set('Cache-Control', CACHE_CONTROL.LONG_CACHE);

			if (object.httpEtag) {
				headers.set('ETag', object.httpEtag);
			}

			// 设置 CORS
			const corsOrigin = getCorsOrigin(referer);
			headers.set('Access-Control-Allow-Origin', corsOrigin);
			headers.set('Vary', 'Origin');

			return new Response(object.body, { status: 200, headers });
		}

		// 默认返回 HTML 页面展示图片
		return new Response(generateImageViewPage(filePath), {
			status: 200,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': CACHE_CONTROL.NO_CACHE,
			},
		});
	} catch (err) {
		console.log(`Error loading object: ${err}`);
		return new Response(generateErrorPage(500, 'Internal Server Error'), {
			status: 500,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Cache-Control': CACHE_CONTROL.NO_CACHE,
			},
		});
	}
}
