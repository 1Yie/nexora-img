# 项目架构说明

## 📁 目录结构

```
nexora-img/
├── src/
│   ├── index.ts                    # 🚪 Worker 入口
│   │
│   ├── types/                      # 📝 类型定义层
│   │   └── index.ts                # - Env, ImageInfo, ImagesListResponse 等
│   │
│   ├── constants/                  # ⚙️ 配置层
│   │   └── index.ts                # - BASE_URL, CACHE_CONTROL, NAV_LINKS 等
│   │
│   ├── utils/                      # 🔧 工具层
│   │   ├── domain.ts               # - 域名验证：isAllowedDomain, isRefererAllowed
│   │   └── format.ts               # - 格式化：isImageFile, getCurrentYear
│   │
│   ├── router/                     # 🛣️ 路由层
│   │   └── index.ts                # - handleRequest: 路由分发主控制器
│   │
│   ├── handlers/                   # 🎯 业务处理层
│   │   ├── home.ts                 # - handleHome: 主页请求
│   │   ├── api.ts                  # - handleApiImages: API 图片列表
│   │   └── image.ts                # - handleImageRequest: 图片文件请求
│   │
│   └── templates/                  # 🎨 页面模板层
│       ├── home.ts                 # - generateHomePage: 主页 HTML
│       ├── error.ts                # - generateErrorPage: 错误页 HTML
│       └── image-view.ts           # - generateImageViewPage: 图片查看页 HTML
│
├── test/                           # 🧪 测试
│   ├── env.d.ts
│   ├── index.spec.ts
│   └── tsconfig.json
│
├── package.json                    # 📦 依赖配置
├── tsconfig.json                   # 🔧 TypeScript 配置
├── vitest.config.mts               # 🧪 测试配置
├── wrangler.jsonc                  # ☁️ Cloudflare Workers 配置
├── worker-configuration.d.ts       # 📝 Worker 类型定义
└── README.md                       # 📖 项目文档
```

## 🔄 请求流程

```
请求进入
    ↓
index.ts (入口)
    ↓
router/index.ts (路由分发)
    ├── "/" → handlers/home.ts → templates/home.ts
    ├── "/api/images" → handlers/api.ts
    └── "/{filename}" → handlers/image.ts → templates/image-view.ts
    ↓
返回响应
```

## 📊 分层架构

### 第 1 层：入口层 (Entry Layer)
- **文件：** `src/index.ts`
- **职责：** Worker 主入口，导出 fetch handler
- **依赖：** router 层

### 第 2 层：路由层 (Router Layer)
- **文件：** `src/router/index.ts`
- **职责：**
  - 解析请求 URL 和参数
  - 验证域名和 referer
  - 路由分发到对应的 handler
- **依赖：** handlers 层、utils 层、templates 层

### 第 3 层：业务处理层 (Handler Layer)
- **文件：** `src/handlers/*.ts`
- **职责：**
  - `home.ts` - 处理主页逻辑
  - `api.ts` - 处理 API 请求，与 R2 交互
  - `image.ts` - 处理图片请求，返回原图或 HTML
- **依赖：** templates 层、constants 层、utils 层

### 第 4 层：模板层 (Template Layer)
- **文件：** `src/templates/*.ts`
- **职责：**
  - `home.ts` - 生成主页 HTML（包含画廊和 JS）
  - `error.ts` - 生成错误页 HTML（404/403/500）
  - `image-view.ts` - 生成图片查看页 HTML
- **依赖：** constants 层、utils 层

### 第 5 层：工具层 (Utility Layer)
- **文件：** `src/utils/*.ts`
- **职责：**
  - `domain.ts` - 域名验证、CORS 处理
  - `format.ts` - 数据格式化、文件类型判断
- **依赖：** constants 层

### 第 6 层：配置层 (Constants Layer)
- **文件：** `src/constants/index.ts`
- **职责：** 存储应用级常量配置
- **依赖：** 无

### 第 7 层：类型层 (Types Layer)
- **文件：** `src/types/index.ts`
- **职责：** TypeScript 类型定义
- **依赖：** 无

## 🔐 安全机制

### 防盗链保护
1. 检查 referer header
2. 验证来源域名是否在白名单中
3. 支持主域名和子域名通配符
4. 未授权访问返回 403 错误页面

### 文件：
- `src/utils/domain.ts` - 域名验证逻辑
- `src/constants/index.ts` - 白名单配置

## 🎨 页面组成

### 主页 (`/`)
- 顶部 Logo 和导航
- 瀑布流图片画廊
- 图片懒加载 + 骨架屏
- 无限滚动分页
- Lightbox 预览
- 响应式布局 + 深色模式

### 图片页 (`/{filename}`)
- 返回按钮
- 图片居中展示
- 文件名显示 + 点击复制
- 骨架屏加载效果

### 错误页 (`404/403/500`)
- 动画 SVG 图标
- 错误说明
- 帮助信息
- 导航链接

## 📡 API 设计

### `GET /api/images?cursor={cursor}`
**功能：** 获取图片列表（分页）

**响应：**
```typescript
{
  images: ImageInfo[];      // 图片信息数组
  cursor: string | null;    // 下一页游标
  hasMore: boolean;         // 是否有更多
}
```

### `GET /{filename}`
**功能：** 获取图片

**参数：**
- `raw=true` - 返回原图（长缓存）
- 无参数 - 返回 HTML 查看页

## 🚀 部署步骤

1. **配置 R2 Bucket**
   ```jsonc
   // wrangler.jsonc
   "r2_buckets": [
     { "binding": "R2_IMG", "bucket_name": "your-bucket" }
   ]
   ```

2. **修改域名**
   - `src/constants/index.ts` - BASE_URL
   - `src/utils/domain.ts` - ALLOWED_DOMAINS

3. **本地测试**
   ```bash
   npm run dev
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

## 🎯 设计原则

1. **单一职责** - 每个文件/函数只做一件事
2. **分层清晰** - 层级之间依赖关系明确
3. **类型安全** - 充分利用 TypeScript 类型系统
4. **易于维护** - 代码结构清晰，便于扩展
5. **性能优化** - 合理使用缓存策略

## 🔧 可扩展性

### 添加新路由
1. 在 `router/index.ts` 中添加路由判断
2. 在 `handlers/` 中创建对应的处理器
3. 在 `templates/` 中创建模板（如需要）

### 添加新功能
1. 在 `types/` 中定义类型
2. 在 `handlers/` 中实现逻辑
3. 在 `utils/` 中添加工具函数（如需要）
4. 在 `constants/` 中添加配置（如需要）

### 示例：添加上传功能
```typescript
// 1. src/types/index.ts
export interface UploadRequest { /* ... */ }

// 2. src/handlers/upload.ts
export async function handleUpload(request: Request, env: Env) { /* ... */ }

// 3. src/router/index.ts
if (request.method === 'POST' && url.pathname === '/api/upload') {
  return handleUpload(request, env);
}
```

## 📝 代码风格

- 使用 async/await 而非 Promise
- 使用箭头函数
- 使用 const 声明常量
- 导出类型和函数
- 添加 JSDoc 注释
