import { getRequestConfig } from "next-intl/server";

/**
 * i18n Configuration
 *
 * Supports: en (English), es (Spanish)
 * UI chrome only — question bank content stays English.
 * Language detection: browser Accept-Language header, with cookie override.
 */

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
