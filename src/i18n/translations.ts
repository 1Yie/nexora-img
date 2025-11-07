/**
 * 国际化语言包
 */

import languagesConfig from './languages.json';

export type Language = keyof typeof languagesConfig;

export const translations: Record<Language, any> = Object.fromEntries(
	Object.entries(languagesConfig).map(([code, config]) => [code, config.translations]),
) as Record<Language, any>;

export const getSupportedLanguages = () =>
	Object.entries(languagesConfig).map(([code, config]) => ({
		code: code as Language,
		name: config.name,
		nativeName: config.nativeName,
	}));
