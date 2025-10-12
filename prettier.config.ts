// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
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
};
