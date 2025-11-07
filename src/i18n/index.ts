/**
 * 国际化工具函数
 */

import { Language, translations, getSupportedLanguages } from './translations';
import languagesConfig from './languages.json';

export class I18n {
  private static instance: I18n;
  private currentLanguage: Language = 'en';
  private translations: Record<string, any>;

  private constructor() {
    // 在服务器端默认使用英文
    this.currentLanguage = 'en';
    this.translations = translations as any;
  }

	public static getInstance(): I18n {
		if (!I18n.instance) {
			I18n.instance = new I18n();
		}
		return I18n.instance;
	}

	/**
	 * 设置当前语言（服务器端使用）
	 */
	public setLanguage(lang: Language): void {
		if (!this.isValidLanguage(lang)) {
			console.warn(`Unsupported language: ${lang}`);
			return;
		}

		this.currentLanguage = lang;
	}

	/**
	 * 从请求 URL 检测语言（优先级高于浏览器语言）
	 */
	public detectLanguageFromRequest(url: URL): void {
		const langParam = url.searchParams.get('lang');
		if (langParam && this.isValidLanguage(langParam as Language)) {
			this.currentLanguage = langParam as Language;
		}
	}

	/**
	 * 从请求 Cookie 检测语言（优先级最高）
	 */
	public detectLanguageFromCookie(request: Request): void {
		const cookieHeader = request.headers.get('cookie');
		console.log('Cookie header:', cookieHeader);
		if (cookieHeader) {
			const cookies = cookieHeader.split(';').map((c) => c.trim());
			const langCookie = cookies.find((c) => c.startsWith('lang='));
			console.log('Lang cookie found:', langCookie);
			if (langCookie) {
				const langValue = langCookie.split('=')[1];
				console.log('Lang value:', langValue);
				if (this.isValidLanguage(langValue as Language)) {
					this.currentLanguage = langValue as Language;
					console.log('Language set to:', this.currentLanguage);
				}
			}
		}
	}

	/**
	 * 从请求头检测浏览器语言
	 */
	public detectLanguageFromRequestHeaders(request: Request): void {
		const acceptLanguage = request.headers.get('accept-language');
		if (acceptLanguage) {
			// 解析 Accept-Language 头，格式如: "zh-CN,zh;q=0.9,en;q=0.8"
			const languages = acceptLanguage
				.split(',')
				.map((lang) => {
					const [code, quality = '1'] = lang.trim().split(';q=');
					return {
						code: code.split('-')[0], // 取主要语言代码，如 zh-CN -> zh
						quality: parseFloat(quality),
					};
				})
				.sort((a, b) => b.quality - a.quality); // 按质量排序

			// 查找支持的语言
			for (const lang of languages) {
				if (lang.code === 'zh') {
					this.currentLanguage = 'zh-CN';
					return;
				} else if (lang.code === 'en') {
					this.currentLanguage = 'en';
					return;
				}
			}
		}
	}

	/**
	 * 验证语言代码是否有效
	 */
	private isValidLanguage(lang: Language): boolean {
		return Object.keys(this.translations).includes(lang);
	}

	/**
	 * 获取当前语言
	 */
	public getCurrentLanguage(): Language {
		return this.currentLanguage;
	}

	/**
	 * 获取翻译文本
	 */
	public t(key: string, params?: Record<string, string | number>): string {
		const keys = key.split('.');
		let value: any = this.translations[this.currentLanguage];

		for (const k of keys) {
			if (value && typeof value === 'object' && k in value) {
				value = value[k];
			} else {
				console.warn(`Translation key not found: ${key}`);
				return key;
			}
		}

		if (typeof value !== 'string') {
			console.warn(`Translation value is not a string: ${key}`);
			return key;
		}

		// 参数替换
		if (params) {
			return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
				return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
			}, value);
		}

		return value;
	}

  /**
   * 获取所有支持的语言
   */
  public getSupportedLanguages(): { code: Language; name: string; nativeName: string }[] {
    return getSupportedLanguages();
  }	/**
	 * 获取语言显示名称
	 */
	public getLanguageName(code: Language): string {
		const lang = this.getSupportedLanguages().find((l) => l.code === code);
		return lang ? lang.name : code;
	}
}

// 导出单例实例
export const i18n = I18n.getInstance();

// 便捷函数
export const t = (key: string, params?: Record<string, string | number>): string => {
	return i18n.t(key, params);
};
