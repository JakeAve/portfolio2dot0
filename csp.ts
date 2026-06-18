import {
  ContentSecurityPolicyDirectives,
  SELF,
  useCSP,
} from "$fresh/runtime.ts";

export const cspDirectives: ContentSecurityPolicyDirectives = {
  defaultSrc: [SELF],
  scriptSrc: [
    SELF,
    "https://www.google.com/recaptcha/",
    "https://www.gstatic.com/recaptcha/",
    "https://esm.sh/",
    "https://cdn.tailwindcss.com",
  ],
  fontSrc: [SELF, "https://fonts.gstatic.com/"],
  styleSrc: [
    SELF,
    "'unsafe-inline'",
    "https://fonts.gstatic.com/",
    "https://fonts.googleapis.com/",
  ],
  frameSrc: ["https://www.google.com/"],
  imgSrc: [SELF, "https://usefresh.dev/"],
};

export function setCSP() {
  useCSP((csp) => {
    for (const [key, val] of Object.entries(cspDirectives)) {
      const directive = key as keyof typeof csp.directives;

      const existing = csp.directives[directive] as string[] | undefined;
      if (!existing || existing.includes("'none'")) {
        // @ts-ignore this is tricky to do, we can assume it's not directives.reportUri
        csp.directives[directive] = [...(val as string[])];
      } else {
        existing.push(...(val as string[]));
      }
    }
  });
}
