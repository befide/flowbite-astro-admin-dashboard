/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
interface ImportMetaEnv {
  readonly SITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}




// K0196115917
// K0196115917
// post@dirk-rathje.de

// sifziz-8dybba-rupkyK
// bodhi4-pirkic-dorDij
// bodhi4-pirkic-dorDij

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

interface ImportMetaEnv {
  readonly ASTRO_DB_REMOTE_URL: string;
  readonly ASTRO_DB_APP_TOKEN: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly GITHUB_CLIENT_ID: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
