import { defineConfig } from "astro/config";

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
// @ts-ignore
export default defineConfig({
  site: process.env.CI
    ? "https://kfb-inventory.netlify.app"
    : `http://localhost:${DEV_PORT}`,

  base: "/", //process.env.CI ? "/flowbite-astro-admin-dashboard" : "/",

  // output: 'server',

  /* Like Vercel, Netlify,… Mimicking for dev. server */
  // trailingSlash: 'always',

  server: {
    /* Dev. server only */
    port: DEV_PORT,
  },

  vite: {
    plugins: [dsv(), tailwindcss()],
  },

  integrations: [
    //
    // tailwind(),
    ...(process.env.NODE_ENV === "production"
      ? []
      : [astroD2({ inline: true })]),
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
