# 国际化 (i18n) 配置

## 支持的语言

项目支持多语言，通过以下文件配置：

- `src/i18n/languages.json` - 定义支持的语言列表
- `src/i18n/lang/` - 存放各个语言的翻译文件

## 添加新语言

### 1. 在 languages.json 中添加语言配置

```json
[
  {
    "code": "en",
    "name": "English",
    "nativeName": "English"
  },
  {
    "code": "zh-CN",
    "name": "Chinese (Simplified)",
    "nativeName": "中文(简体)"
  },
  {
    "code": "ja",
    "name": "Japanese",
    "nativeName": "日本語"
  }
]
```

### 2. 创建翻译文件

在 `src/i18n/lang/` 目录下创建对应的翻译文件，如 `ja.json`：

```json
{
  "nav": {
    "home": "ホーム",
    "blog": "ブログ",
    "about": "について",
    "status": "ステータス",
    "monitor": "モニター"
  },
  "pageTitles": {
    "home": "Nexora - 画像ライブラリ",
    "imageView": "{{fileName}} - Nexora",
    "error": "エラー - Nexora"
  }
  // ... 其他翻译内容
}
```

### 3. 在 i18n/index.ts 中导入翻译文件

```typescript
import jaTranslations from './lang/ja.json';

// 在构造函数中添加：
this.translations = {
  'en': enTranslations,
  'zh-CN': zhCNTranslations,
  'ja': jaTranslations  // 添加日语翻译
};
```

## 语言检测

系统按以下优先级检测语言：

1. URL 参数 `?lang=xx` (最高优先级)
2. 浏览器 Accept-Language 头
3. 默认英文

## 使用翻译

在模板中使用 `t()` 函数：

```typescript
t('nav.home')  // 导航首页
t('footer.copyright', { year: 2025, author: 'ichiyo' })  // 参数替换
```
