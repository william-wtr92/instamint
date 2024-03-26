module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
  },
  localePath:
    typeof window === "undefined"
      ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        require("path").resolve("./public/locales")
      : "/locales",
}
