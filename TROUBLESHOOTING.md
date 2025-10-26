# 本地开发 404 问题解决方案

## 🐛 问题描述

访问本地开发服务器 `http://localhost:8787/` 时返回 404 错误。

## 🔍 原因分析

在原始代码中，路由器会检查请求的域名是否匹配 `BASE_URL`（即 `img.ichiyo.in`）：

```typescript
// 原代码
if (url.host !== BASE_URL) {
  return new Response(generateErrorPage(404, "Not Found"), {
    status: 404,
    // ...
  });
}
```

当你在本地开发时：
- 实际访问域名：`localhost:8787` 或 `127.0.0.1:8787`
- 配置的 BASE_URL：`img.ichiyo.in`
- 结果：域名不匹配 → 返回 404

## ✅ 解决方案

已修改 `src/router/index.ts`，添加本地开发环境检测：

```typescript
// 修改后
const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
if (!isLocalhost && url.host !== BASE_URL) {
  return new Response(generateErrorPage(404, "Not Found"), {
    status: 404,
    // ...
  });
}
```

### 工作原理

1. **本地开发**（`localhost` 或 `127.0.0.1`）
   - 跳过域名检查 ✅
   - 正常访问主页和 API

2. **生产环境**（实际域名）
   - 检查域名是否匹配 `BASE_URL`
   - 不匹配则返回 404
   - 防止通过其他域名访问

## 🧪 测试

现在可以正常访问：

```bash
# 启动开发服务器
npm run dev

# 访问以下地址都可以正常工作
http://localhost:8787/           # ✅ 主页
http://127.0.0.1:8787/           # ✅ 主页
http://localhost:8787/api/images # ✅ API
```

## 📝 其他注意事项

### 如果仍然 404

1. **检查 R2 配置**
   ```jsonc
   // wrangler.jsonc
   "r2_buckets": [
     {
       "binding": "R2_IMG",
       "bucket_name": "your-bucket-name"  // 确保已修改
     }
   ]
   ```

2. **检查终端输出**
   - 确保看到 `Ready on http://127.0.0.1:8787`
   - 查看是否有错误信息

3. **清除浏览器缓存**
   - 按 `Ctrl+Shift+R` 强制刷新
   - 或使用无痕模式访问

### 如果访问 API 出错

API `/api/images` 需要 R2 bucket 中有图片文件。如果 bucket 为空：
- 主页会显示 "No images found"
- API 会返回空数组：`{"images": [], "cursor": null, "hasMore": false}`

这是**正常行为**，不是错误。

## 🚀 部署后的行为

部署到生产环境后：

```typescript
// 生产环境访问
https://img.ichiyo.in/          // ✅ 正常
https://other-domain.com/       // ❌ 404（域名不匹配）
```

这样可以防止通过其他域名访问你的 Worker。

## 💡 完全禁用域名检查（不推荐）

如果你想完全禁用域名检查（例如支持多域名访问），可以注释掉整个检查：

```typescript
// 注释掉域名检查
// const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
// if (!isLocalhost && url.host !== BASE_URL) {
//   return new Response(generateErrorPage(404, "Not Found"), {
//     status: 404,
//     headers: {
//       "Content-Type": "text/html; charset=utf-8",
//       "Cache-Control": CACHE_CONTROL.NO_CACHE,
//     },
//   });
// }
```

⚠️ **警告**：禁用域名检查后，任何人都可以通过自己的域名访问你的 Worker，可能导致流量被盗用。
