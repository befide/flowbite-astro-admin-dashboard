import { defineConfig } from "astro/config"
import rehypeRewrite from "rehype-rewrite"
import remarkSectionize from "remark-sectionize"

import pdf from "astro-pdf"
import spaceCommander from "./src/lib/space-commander"

import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import astroD2 from "astro-d2"
import dsv from "@rollup/plugin-dsv"

import mdx from "@astrojs/mdx"
import AstroPWA from "@vite-pwa/astro"

const DEV_PORT = 4350

// @ts-ignore
export default defineConfig({
  base: "/",

  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  }, //process.env.CI ? "/flowbite-astro-admin-dashboard" : "/",
  integrations: [
    ...(process.env.NODE_ENV === "production" ? [] : [astroD2({ inline: true })]),
    sitemap(),
    mdx(),
    // pdf({
    //   baseOptions: {
    //     path: "/pdfs[pathname].pdf",
    //     throwOnFail: true,
    //     pdf: {
    //       printBackground: true,
    //       format: "A4",
    //       scale: 1,
    //       preferCSSPageSize: true,
    //     },
    //   },
    //   pages: (pathname) => {
    //     if (pathname.indexOf("/en/data/formal-organizations/all") > -1) {
    //       return {
    //         path: "/pdfs/" + pathname.replaceAll("/", "__").replace(/__$/, "") + ".pdf",
    //       }
    //     }
    //   },
    // }),
    AstroPWA({
      /* your pwa options */
    }),
  ],
  // output: 'server',

  /* Like Vercel, Netlify,… Mimicking for dev. server */
  // trailingSlash: 'always',

  markdown: {
    remarkPlugins: [
      //     // remarkDirective,
      //
      remarkSectionize,
      // [
      //   smartypants,
      //   {
      //     options: {
      //       openingQuotes: { double: "»", single: "›" },
      //       closingQuotes: { double: "«", single: "‹" },
      //     },
      //   },
      // ],
    ],
    rehypePlugins: [
      //     // [rehypeFigure, { className: "md" }],
      //     // [
      //     //   rehypeCitation,
      //     //   {
      //     //     bibliography: 'src/kfb_bf2035__used.csl.json',
      //     //     linkCitations: true,
      //     //   },
      //     // ],
      //
      //     // [
      //     //   rehypeAddClasses,
      //     //   {
      //     //     'img,figure,table,section,h1,h2,h3,h4,p,ol,ul,li,blockquote': 'md',
      //     //   },
      //     // ],
      [
        rehypeRewrite,
        {
          rewrite: (node) => {
            if (node.type === "text") {
              node.value = spaceCommander(node.value)
            }
          },
        },
      ],
    ],
  },
  server: {
    /* Dev. server only */
    port: DEV_PORT,
  },

  site: process.env.CI ? "https://kfb-inventory.netlify.app" : `http://localhost:${DEV_PORT}`,

  vite: {
    logLevel: "info",
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    plugins: [
      // @ts-ignore
      dsv(),
      // @ts-ignore
      tailwindcss(),
    ],
  },
})

//
// AstroPWA({
//   /* your pwa options */
// }),
// //  pocketbase({
// //   // default values
// // pocketbaseIntegration({
// //   // Make sure to use the same URL as in your pocketbaseLoader configuration
// //   url: "https://bit-kitchen.pockethost.io/"
// // })
//
// // })
// ],
//
// // env: {
// //   schema: {
// //     ASTRO_POCKETBASE_ADMIN_EMAIL: envField.string({context: "server", access: "secret"}),
// //     ASTRO_POCKETBASE_ADMIN_PASSWORD: envField.string({context: "server", access: "secret"}),
// //     PUBLIC_ASTRO_POCKETBASE_URL: envField.string({context: "server", access: "public"}),
// //   },
// // },
//
// // adapter: netlify(),
