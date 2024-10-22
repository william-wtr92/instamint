module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    localeDetection: false,
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
}
