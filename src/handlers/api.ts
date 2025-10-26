import { Env, ImagesListResponse } from '../types';
import { isImageFile } from '../utils/format';
import { IMAGES_PER_PAGE, CACHE_CONTROL } from '../constants';

/**
 * 处理 API 图片列表请求
 */
export async function handleApiImages(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const cursor = url.searchParams.get('cursor') || '';

	try {
		const listOptions: R2ListOptions = { limit: IMAGES_PER_PAGE };
		if (cursor) {
			listOptions.cursor = cursor;
		}

		const listed = await env.R2_IMG.list(listOptions);

		const images = listed.objects
			.filter((obj) => isImageFile(obj.key))
			.map((obj) => ({
				key: obj.key,
				size: obj.size,
				uploaded: obj.uploaded,
			}));

		const responseData: ImagesListResponse = {
			images,
			cursor: listed.truncated ? listed.cursor : null,
			hasMore: listed.truncated,
		};

		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': CACHE_CONTROL.NO_CACHE,
			},
		});
	} catch (err) {
		console.error('Error listing images:', err);
		return new Response(JSON.stringify({ images: [], cursor: null, hasMore: false }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
