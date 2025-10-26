/**
 * 格式化工具函数
 */

/**
 * 判断文件是否为图片
 */
export function isImageFile(filename: string): boolean {
	const ext = filename.split('.').pop()?.toLowerCase();
	return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
}

/**
 * 获取当前年份
 */
export function getCurrentYear(): number {
	return new Date().getFullYear();
}
