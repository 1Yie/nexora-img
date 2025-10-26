# 🚀 快速配置指南

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
