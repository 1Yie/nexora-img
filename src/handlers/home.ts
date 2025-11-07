import { CACHE_CONTROL } from '../constants';
import { generateHomePage } from '../templates/home';

/**
 * 处理主页请求
 */
export async function handleHome(pageType: 'home' | 'error' | 'image' = 'home', pageData?: { status: number; message: string } | { imagePath: string }, request?: Request): Promise<Response> {
	return new Response(generateHomePage(pageType, pageData, request), {
		status: pageData && 'status' in pageData ? pageData.status : 200,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': CACHE_CONTROL.NO_CACHE,
		},
	});
}
