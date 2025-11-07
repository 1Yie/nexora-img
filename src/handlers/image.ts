import { Env } from '../types';
import { getCorsOrigin } from '../utils/domain';
import { CACHE_CONTROL } from '../constants';

/**
 * 处理图片原图请求（raw=true）
 */
export async function handleImageRequest(request: Request, env: Env, filePath: string): Promise<Response> {
	const referer = request.headers.get('referer');

	try {
		const object = await env.R2_IMG.get(filePath);

		if (!object) {
			console.log(`File not found: ${filePath}`);
			return new Response('Not Found', { status: 404 });
		}

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
	} catch (err) {
		console.log(`Error loading object: ${err}`);
		return new Response('Internal Server Error', { status: 500 });
	}
}
