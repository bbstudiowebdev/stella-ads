// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Primary host. Must match site.url in src/data/site.ts and public/robots.txt.
// TODO(launch): confirm apex vs www once the domain is connected in Vercel.
const SITE = 'https://www.stellaads.co.za';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({ filter: (page) => !/\/(thanks|form-error|404)\/?$/.test(page) }),
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
