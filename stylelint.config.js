/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-tailwindcss",
    "stylelint-prettier/recommended",
  ],
  plugins: ["stylelint-order"],
  rules: {
    // "prettier/prettier": true,
    "order/order": ["custom-properties", "declarations"],
    "order/properties-order": [
      [
        {
          emptyLineBefore: "threshold",
          properties: ["display"],
        },
        {
          emptyLineBefore: "always",
          properties: [
            "text-transform",
            "font-family",
            "font-size",
            "font-weight",
            "font-style",
            "letter-spacing",
            "font-variant-numeric",
          ],
        },
        {
          emptyLineBefore: "threshold",
          properties: ["color", "background-color"],
        },
        {
          emptyLineBefore: "threshold",
          properties: [
            "fill",
            "fill-opacity",
            "stroke",
            "stroke-width",
            "stroke-dasharray",
          ],
        },
        {
          emptyLineBefore: "threshold",
          properties: ["height", "width"],
        },
        {
          emptyLineBefore: "threshold",
          properties: [
            "margin",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "padding",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
          ],
        },
        {
          emptyLineBefore: "always",
          properties: ["border"],
        },
        {
          emptyLineBefore: "always",
          properties: [
            "position",
            "top",
            "right",
            "bottom",
            "left",
            "overflow",
            "transform",
          ],
        },
      ],
      {
        unspecified: "bottom",
        emptyLineBeforeUnspecified: "threshold",
        emptyLineMinimumPropertyThreshold: 4,
      },
    ],
  },
}
