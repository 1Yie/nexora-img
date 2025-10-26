# 🚀 快速配置指南

从原有的 `worker.js` 迁移到新的 TypeScript 项目，请按照以下步骤操作：

## 📋 必须配置的项目

### 1. ⚙️ 配置 R2 Bucket 绑定

**文件：** `wrangler.jsonc`

```jsonc
"r2_buckets": [
  {
    "binding": "R2_IMG",
    "bucket_name": "你的实际 bucket 名称"  // 👈 在这里修改
  }
]
```

### 2. 🌐 配置基础域名

**文件：** `src/constants/index.ts`

```typescript
// 基础域名
export const BASE_URL = "img.ichiyo.in";  // 👈 修改为你的域名
```

### 3. 🔐 配置允许的域名（防盗链）

**文件：** `src/utils/domain.ts`

```typescript
// 允许的域名列表
const ALLOWED_DOMAINS = [
  "ichiyo.in",           // 👈 修改为你的主域名
  "dash.cloudflare.com", // Cloudflare Dashboard（保留）
  "localhost",           // 本地开发（保留）
];
```

**注意：** 所有 `*.ichiyo.in` 的子域名会自动允许，如果你的域名不同，子域名判断会自动适配。

### 4. 🔗 配置导航链接

**文件：** `src/constants/index.ts`

```typescript
// 导航链接
export const NAV_LINKS = [
  { name: "Home", url: "https://img.ichiyo.in" },      // 👈 修改
  { name: "Blog", url: "https://ichiyo.in/blog" },     // 👈 修改
  { name: "About", url: "https://ichiyo.in/about" },   // 👈 修改
  { name: "Status", url: "https://status.ichiyo.in" }, // 👈 修改
  { name: "Monitor", url: "https://monitor.ichiyo.in" },// 👈 修改
] as const;
```

## 📝 可选配置

### 修改每页图片数量

**文件：** `src/constants/index.ts`

```typescript
// 每次请求图片数量限制
export const IMAGES_PER_PAGE = 50;  // 👈 根据需要调整
```

### 修改支持的图片格式

**文件：** `src/constants/index.ts`

```typescript
// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  // 👈 根据需要添加或删除
];
```

## 🔍 配置检查清单

完成以下配置后，即可部署：

- [ ] 已修改 `wrangler.jsonc` 中的 `bucket_name`
- [ ] 已修改 `src/constants/index.ts` 中的 `BASE_URL`
- [ ] 已修改 `src/utils/domain.ts` 中的 `ALLOWED_DOMAINS`
- [ ] 已修改 `src/constants/index.ts` 中的 `NAV_LINKS`（可选）
- [ ] 已在 Cloudflare Dashboard 创建对应的 R2 Bucket
- [ ] 已确保域名在 Cloudflare Workers 中配置了路由

## 🧪 本地测试

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:8787
```

## 🚀 部署

```bash
# 部署到 Cloudflare Workers
npm run deploy
```

## 🎯 关键区别对比

### 原 worker.js
```javascript
// ❌ 所有代码在一个文件中
// ❌ 硬编码的域名和配置
// ❌ 没有类型检查
// ❌ 难以维护和扩展

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const baseUrl = "img.ichiyo.in"; // 硬编码
  // ... 1000+ 行代码
}
```

### 新 TypeScript 项目
```typescript
// ✅ 代码分层清晰
// ✅ 配置集中管理
// ✅ 完整的类型检查
// ✅ 易于维护和扩展

// src/index.ts
import { handleRequest } from "./router";

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
```

## 📂 主要改进

| 方面 | 原 worker.js | 新 TypeScript 项目 |
|------|-------------|------------------|
| **代码结构** | 单文件 1000+ 行 | 多文件分层架构 |
| **类型安全** | 无 | TypeScript 完整类型 |
| **配置管理** | 硬编码 | 集中配置 |
| **可维护性** | 困难 | 容易 |
| **可扩展性** | 困难 | 容易 |
| **测试** | 无 | Vitest 支持 |
| **开发体验** | 一般 | 优秀（类型提示、自动补全）|

## 💡 迁移建议

1. **保留原 worker.js** - 作为备份，不要删除
2. **逐步测试** - 先在本地测试所有功能
3. **灰度发布** - 可以先部署到测试环境
4. **监控日志** - 部署后观察 Cloudflare Workers 日志

## 🆘 常见问题

### Q: 如何添加新的允许域名？
A: 编辑 `src/utils/domain.ts`，在 `ALLOWED_DOMAINS` 数组中添加。

### Q: 如何修改缓存策略？
A: 编辑 `src/constants/index.ts` 中的 `CACHE_CONTROL` 对象。

### Q: 如何自定义错误页面？
A: 编辑 `src/templates/error.ts` 中的 HTML 模板。

### Q: 本地开发时如何测试 R2？
A: 使用 `wrangler dev` 会自动连接到你的 R2 bucket（需要先配置）。

## 📖 更多文档

- [README.md](./README.md) - 项目总览
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 详细架构说明
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
