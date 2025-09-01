import {defineConfig, fontProviders} from "astro/config";
import rehypeRewrite from 'rehype-rewrite';
import remarkSectionize from 'remark-sectionize';



import spaceCommander from "./src/lib/space-commander";


import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroD2 from "astro-d2";
import dsv from "@rollup/plugin-dsv";

import mdx from "@astrojs/mdx";

// import {pocketbaseIntegration} from "astro-integration-pocketbase"
import netlify from "@astrojs/netlify";
import AstroPWA from "@vite-pwa/astro";

const DEV_PORT = 4350;

// https://astro.build/config
export default defineConfig({
  site: process.env.CI
    ? "https://kfb-inventory.netlify.app"
    : `http://localhost:${DEV_PORT}`,
  // experimental: {
  //   fonts: [{
  //     provider: fontProviders.fontsource(),
  //     name: "Barlow Semi Condensed",
  //     cssVariable: "--font-barlow-semi-condensed"
  //   },
  //     {
  //       provider: fontProviders.fontsource(),
  //       name: "Barlow Condensed",
  //       cssVariable: "--font-barlow-condensed"
  //     }]
  // },
  base: "/", //process.env.CI ? "/flowbite-astro-admin-dashboard" : "/",
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
  // output: 'server',

  /* Like Vercel, Netlify,… Mimicking for dev. server */
  // trailingSlash: 'always',

  server: {
    /* Dev. server only */
    port: DEV_PORT,
  },
  markdown: {
    remarkPlugins: [
  //     // remarkDirective,
  //
      remarkSectionize,
  //     //   [smartypants, {
  //     //     options: {
  //     //       openingQuotes: { double: "»", single: "›" },
  //     //       closingQuotes: { double: "«", single: "‹" },
  //     //     }
  //     //   }],
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
          rewrite: (node: any) => {
            if (node.type === 'text') {
              node.value = spaceCommander(node.value);
            }
          },
        },
      ],
    ],
  },

  vite: {
    logLevel: 'info',
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    plugins: [
      // @ts-ignore
      dsv(),
      tailwindcss()],
  },

  integrations: [
    //
    // tailwind(),
    ...(process.env.NODE_ENV === "production"
      ? []
      : [astroD2({inline: true})]),
    sitemap(),
    mdx(),
    AstroPWA({
      /* your pwa options */
    }),
    //  pocketbase({
    //   // default values
    // pocketbaseIntegration({
    //   // Make sure to use the same URL as in your pocketbaseLoader configuration
    //   url: "https://bit-kitchen.pockethost.io/"
    // })

    // })
  ],

  // env: {
  //   schema: {
  //     ASTRO_POCKETBASE_ADMIN_EMAIL: envField.string({context: "server", access: "secret"}),
  //     ASTRO_POCKETBASE_ADMIN_PASSWORD: envField.string({context: "server", access: "secret"}),
  //     PUBLIC_ASTRO_POCKETBASE_URL: envField.string({context: "server", access: "public"}),
  //   },
  // },

  adapter: netlify(),
});
