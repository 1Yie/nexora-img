import { CACHE_CONTROL } from '../constants';
import { generateHomePage } from '../templates/home';
import { generateImageViewPage } from '../templates/image-view';

/**
 * 处理主页请求
 */
export async function handleHome(pageType: 'home' | 'error' | 'image' = 'home', pageData?: { status: number; message: string } | { imagePath: string }, request?: Request): Promise<Response> {
	let htmlContent: string;
	
	if (pageType === 'image' && pageData && 'imagePath' in pageData) {
		// 图片详情页面，使用image-view.ts的模板
		htmlContent = generateImageViewPage(pageData.imagePath);
	} else {
		// 主页或错误页面，使用home.ts的模板
		htmlContent = generateHomePage(pageType, pageData, request);
	}
	
	return new Response(htmlContent, {
		status: pageData && 'status' in pageData ? pageData.status : 200,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': CACHE_CONTROL.NO_CACHE,
		},
	});
}
