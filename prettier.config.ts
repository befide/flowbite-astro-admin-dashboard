// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  semi: false,
  tabWidth: 2,
  useTabs: false,
  arrowParens: "always",
  bracketSameLine: false,
  objectWrap: "preserve",
  bracketSpacing: true,
  experimentalOperatorPosition: "end",
  experimentalTernaries: false,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  singleAttributePerLine: false,
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: false,
  proseWrap: "preserve",
  insertPragma: false,
  requirePragma: false,
  embeddedLanguageFormatting: "auto",
  printWidth: 100,
  plugins: ["prettier-plugin-astro", "stylelint-prettier", "prettier-plugin-tailwindcss", "prettier-plugin-packagejson"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
