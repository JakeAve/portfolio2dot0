import type { Middleware } from "fresh";

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "font-src 'self' https://fonts.gstatic.com/",
  "style-src 'self' 'unsafe-inline' https://fonts.gstatic.com/ https://fonts.googleapis.com/",
  "frame-src https://www.google.com/",
  "img-src 'self' https://usefresh.dev/",
  "media-src 'self'",
].join("; ");

export const handler: Middleware = async (ctx) => {
  const response = await ctx.next();
  response.headers.set("Content-Security-Policy", CSP);
  return response;
};
