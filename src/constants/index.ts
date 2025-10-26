/**
 * 应用常量配置
 */

// 基础域名
export const BASE_URL = "img.ichiyo.in";

// 每次请求图片数量限制
export const IMAGES_PER_PAGE = 50;

// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
];

// 缓存控制
export const CACHE_CONTROL = {
  NO_CACHE: "no-cache, no-store",
  LONG_CACHE: "public, max-age=31536000", // 1 年
} as const;

// 导航链接
export const NAV_LINKS = [
  { name: "Home", url: "https://img.ichiyo.in" },
  { name: "Blog", url: "https://ichiyo.in/blog" },
  { name: "About", url: "https://ichiyo.in/about" },
  { name: "Status", url: "https://status.ichiyo.in" },
  { name: "Monitor", url: "https://monitor.ichiyo.in" },
] as const;
