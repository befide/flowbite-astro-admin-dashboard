// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  semi: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5",
  plugins: [
    "prettier-plugin-astro",
    "stylelint-prettier",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-packagejson",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
