import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const DEV_PORT = 4322;

// https://astro.build/config
export default defineConfig({
	site: process.env.CI
		? 'https://befide.github.io'
		: `http://localhost:${DEV_PORT}`,
	base: process.env.CI ? '/bf2035-data-dashboard/' : undefined,
	// trailingSlash: "always",

	integrations: [
		//
		sitemap(),
		tailwind(),
	],
});
