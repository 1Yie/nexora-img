# Nexora Image Hosting Service

基于 Cloudflare Workers 和 R2 存储的图片托管服务。

## 📚 文档导航

- **[快速开始指南 (QUICKSTART.md)](./QUICKSTART.md)** - 配置和部署步骤

## 项目结构

```
nexora-img/
├── src/
│   ├── index.ts                 # Worker 入口文件
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── constants/
│   │   └── index.ts            # 应用常量配置
│   ├── utils/
│   │   ├── domain.ts           # 域名验证工具
│   │   └── format.ts           # 格式化工具
│   ├── handlers/
│   │   ├── home.ts             # 主页处理器
│   │   ├── api.ts              # API 请求处理器
│   │   └── image.ts            # 图片请求处理器
│   ├── templates/
│   │   ├── home.ts             # 主页 HTML 模板
│   │   ├── error.ts            # 错误页面 HTML 模板
│   │   └── image-view.ts       # 图片查看页面 HTML 模板
│   └── router/
│       └── index.ts            # 路由主控制器
├── test/
│   └── index.spec.ts           # 测试文件
├── package.json
├── tsconfig.json
├── wrangler.jsonc              # Wrangler 配置
└── README.md
```

## 功能特性

- ✅ 图片列表展示（瀑布流布局）
- ✅ 图片懒加载
- ✅ 防盗链保护
- ✅ 图片预览（Lightbox）
- ✅ 分页加载
- ✅ 响应式设计
- ✅ 深色模式支持
- ✅ 图片链接复制
- ✅ 错误页面美化

## 文件分层说明

### 1. **入口层** (`src/index.ts`)
- Worker 的主入口
- 导出 fetch 处理函数

### 2. **路由层** (`src/router/`)
- 路由分发逻辑
- 请求解析和验证
- 调用对应的处理器

### 3. **处理器层** (`src/handlers/`)
- `home.ts` - 处理主页请求
- `api.ts` - 处理 API 请求（图片列表）
- `image.ts` - 处理图片文件请求

### 4. **模板层** (`src/templates/`)
- `home.ts` - 主页 HTML
- `error.ts` - 错误页面 HTML
- `image-view.ts` - 图片查看页 HTML

### 5. **工具层** (`src/utils/`)
- `domain.ts` - 域名验证
- `format.ts` - 格式化工具

### 6. **配置层** (`src/constants/`)
- 应用常量配置
- 缓存策略
- 导航链接

### 7. **类型层** (`src/types/`)
- TypeScript 类型定义
- 接口定义

## 配置说明

### 1. 修改 R2 Bucket 绑定

编辑 `wrangler.jsonc`，将 `your-bucket-name` 替换为你的实际 R2 bucket 名称：

```jsonc
"r2_buckets": [
  {
    "binding": "R2_IMG",
    "bucket_name": "your-actual-bucket-name"
  }
]
```

### 2. 修改域名配置

编辑 `src/constants/index.ts`，修改基础域名：

```typescript
export const BASE_URL = "your-domain.com";
```

编辑 `src/utils/domain.ts`，修改允许的域名列表：

```typescript
const ALLOWED_DOMAINS = [
  "your-domain.com",
  "dash.cloudflare.com",
  "localhost",
];
```

### 3. 修改导航链接

编辑 `src/constants/index.ts`，修改 `NAV_LINKS`：

```typescript
export const NAV_LINKS = [
  { name: "Home", url: "https://your-domain.com" },
  { name: "Blog", url: "https://your-domain.com/blog" },
  // ...
];
```

## 开发命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 生成类型定义
npm run cf-typegen

# 部署到 Cloudflare
npm run deploy

# 运行测试
npm test
```

## API

### GET `/`
返回主页 HTML

### GET `/api/images`
获取图片列表（分页）

**查询参数：**
- `cursor` (可选) - 分页游标

**响应：**
```json
{
  "images": [
    {
      "key": "image.jpg",
      "size": 123456,
      "uploaded": "2025-10-26T00:00:00.000Z"
    }
  ],
  "cursor": "next-cursor",
  "hasMore": true
}
```

### GET `/{filename}`
获取图片或图片查看页面

**查询参数：**
- `raw=true` - 返回原图（带长缓存）
- 不带参数 - 返回图片查看页面 HTML

## 技术栈

- **运行时：** Cloudflare Workers
- **存储：** Cloudflare R2
- **语言：** TypeScript
- **构建工具：** Wrangler
- **测试：** Vitest

## 防盗链说明

本项目实现了简单的防盗链保护：

1. 只允许来自指定域名的 referer
2. 允许的域名在 `src/utils/domain.ts` 中配置
3. 支持主域名和子域名通配符

## 注意事项

1. 确保在 Cloudflare Dashboard 中创建了 R2 bucket
2. 部署前先在本地测试
3. 注意修改所有域名相关配置
4. 生产环境建议启用 Smart Placement
