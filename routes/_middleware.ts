import type { Middleware } from "fresh";

// Vite statically replaces `import.meta.env.DEV` at build time; declare it so
// the type-checker knows about it (the project has no vite/client types).
declare global {
  interface ImportMeta {
    readonly env: { readonly DEV: boolean };
  }
}

// Fresh stamps a per-request nonce on every <script>/<style> it renders and
// attaches that same nonce to the Response via this globally-registered
// symbol. We read it back here so the CSP can allow Fresh's inline hydration
// bootstrap. Without it, `script-src 'self'` blocks the boot script and no
// islands hydrate.
const FRESH_NONCE = Symbol.for("__freshNonce");

// In dev, Vite injects its own inline scripts without a nonce (HMR client,
// refresh preamble). A nonce makes browsers ignore 'unsafe-inline', so dev uses
// 'unsafe-inline' (and no nonce) while prod uses the strict per-request nonce.
const DEV = import.meta.env.DEV;

function buildCSP(nonce?: string): string {
  const scriptSrc = [
    "'self'",
    "https://www.google.com/recaptcha/",
    "https://www.gstatic.com/recaptcha/",
    DEV ? "'unsafe-inline'" : (nonce ? `'nonce-${nonce}'` : ""),
  ].filter(Boolean).join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "font-src 'self' https://fonts.gstatic.com/",
    "style-src 'self' 'unsafe-inline' https://fonts.gstatic.com/ https://fonts.googleapis.com/",
    "frame-src https://www.google.com/",
    "img-src 'self' https://usefresh.dev/",
    "media-src 'self'",
  ].join("; ");
}

export const handler: Middleware<unknown> = async (ctx) => {
  const response = await ctx.next();
  const nonce = (response as Response & { [FRESH_NONCE]?: string })[
    FRESH_NONCE
  ];
  response.headers.set("Content-Security-Policy", buildCSP(nonce));
  return response;
};
