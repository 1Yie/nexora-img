# 国际化 (i18n) 配置

## 支持的语言

项目支持多语言，目前支持以下语言：

- **英语 (en)** - English
- **简体中文 (zh-CN)** - Chinese (Simplified)  
- **日语 (ja)** - Japanese
- **繁体中文 (zh-TW)** - Chinese (Traditional)

通过以下文件配置：

- `src/i18n/languages.json` - 定义支持的语言列表和翻译内容
- `src/i18n/index.ts` - i18n 核心实现
- `src/i18n/translations.ts` - 翻译数据导出

## 文件结构

```
src/i18n/
├── README.md          # 本文档
├── index.ts           # i18n 核心实现
├── languages.json     # 语言配置和翻译内容
└── translations.ts    # 翻译数据导出
```

## 添加新语言

### 1. 在 languages.json 中添加语言配置

在 `languages.json` 文件中添加新的语言配置：

```json
{
  "en": {
    "name": "English",
    "nativeName": "English",
    "translations": {
      // 翻译内容...
    }
  },
  "zh-CN": {
    "name": "Chinese (Simplified)",
    "nativeName": "中文(简体)",
    "translations": {
      // 翻译内容...
    }
  },
  "ja": {
    "name": "Japanese",
    "nativeName": "日本語",
    "translations": {
      // 翻译内容...
    }
  },
  "fr": {
    "name": "French",
    "nativeName": "Français",
    "translations": {
      // 添加法语翻译内容
    }
  }
}
```

### 2. 添加翻译内容

在对应语言的 `translations` 对象中添加完整的翻译内容，确保包含所有必要的翻译键。

## 语言检测优先级

系统按以下优先级检测语言：

1. **Cookie 语言设置** (最高优先级) - 通过 `lang` cookie 设置
2. **浏览器语言** - 根据浏览器 Accept-Language 头检测
3. **默认语言** - 默认为英语 (en)

## 使用翻译

### 在模板中使用

在模板文件中使用 `t()` 函数：

```typescript
import { t } from '../i18n';

// 基本翻译
t('nav.home')  // 导航首页

// 带参数的翻译
t('footer.copyright', { year: 2025, author: 'ichiyo' })  // 参数替换

// 页面标题
t('pageTitles.imageView', { fileName: 'example.jpg' })
```

### 在 JavaScript 中使用

在 JavaScript 代码中使用翻译变量：

```javascript
const translations = {
  copied: "${t('imageView.copied')}",
  copyFailed: "${t('imageView.copyFailed')}"
};
```

## 翻译键结构

### 导航 (nav)
- `nav.home` - 首页
- `nav.blog` - 博客
- `nav.about` - 关于
- `nav.status` - 状态
- `nav.monitor` - 监控

### 页面标题 (pageTitles)
- `pageTitles.home` - 首页标题
- `pageTitles.imageView` - 图片查看页标题 (支持 {{fileName}} 参数)
- `pageTitles.error` - 错误页面标题

### 首页 (home)
- `home.title` - 首页主标题
- `home.subtitle` - 首页副标题
- `home.loading` - 加载中文本
- `home.noImages` - 无图片提示
- `home.stats` - 统计信息

### 图片查看页 (imageView)
- `imageView.backToGallery` - 返回图库
- `imageView.copied` - 已复制提示
- `imageView.copyFailed` - 复制失败提示

### 错误页面 (error)
- `error.titles.404` - 404 错误标题
- `error.titles.403` - 403 错误标题
- `error.titles.500` - 500 错误标题
- `error.titles.default` - 默认错误标题
- `error.titles.help` - 帮助标题
- `error.messages.404` - 404 错误信息
- `error.messages.403` - 403 错误信息
- `error.messages.500` - 500 错误信息
- `error.messages.default` - 默认错误信息
- `error.backToHome` - 返回首页

### 页脚 (footer)
- `footer.copyright` - 版权信息 (支持 {{year}} 和 {{author}} 参数)
- `footer.poweredBy` - 技术支持信息 (支持 {{provider}} 参数)
- `footer.openSource` - 开源信息 (支持 {{platform}} 参数)

### 语言设置 (language)
- `language.label` - 语言标签
- `language.switchTo` - 切换到语言 (支持 {{language}} 参数)
- `language.current` - 当前语言 (支持 {{language}} 参数)

## 语言切换功能

前端页面提供语言切换功能，用户可以通过点击语言按钮切换语言。切换后会自动设置 cookie 并刷新页面。

## 开发注意事项

1. **添加新翻译键时**，需要在所有支持的语言中都添加对应的翻译内容
2. **参数替换**使用双花括号格式：`{{parameterName}}`
3. **翻译键命名**遵循模块化结构，使用点号分隔
4. **保持翻译一致性**，确保所有语言的翻译内容完整且准确
