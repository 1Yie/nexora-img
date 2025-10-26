// 环境变量类型定义
export interface Env {
	R2_IMG: R2Bucket;
}

// 图片信息类型
export interface ImageInfo {
	key: string;
	size: number;
	uploaded: Date;
}

// API 响应类型
export interface ImagesListResponse {
	images: ImageInfo[];
	cursor: string | null;
	hasMore: boolean;
}

// 帮助文本类型
export interface HelpText {
	title: string;
	content: string;
}

// 路由处理器类型
export type RouteHandler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;
