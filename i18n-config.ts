export const i18n = {
  locales: [
    { code: "en-US", name: "English", icon: "🇺🇸" },
    { code: "ua", name: "Ukrainian", icon: "ua" },
    { code: "ru", name: "Russian", icon: "ru" },
  ],
  defaultLocale: "ua-Ukrainian",
};

export type I18nConfig = typeof i18n;
export type Locale = I18nConfig["locales"][number];
