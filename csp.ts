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
  ],
  fontSrc: [SELF, "https://fonts.gstatic.com/"],
  styleSrc: [
    SELF,
    "https://fonts.gstatic.com/",
    "https://fonts.googleapis.com/",
  ],
  frameSrc: ["https://www.google.com/"],
  imgSrc: [SELF, "https://fresh.deno.dev/"],
};

export function setCSP() {
  useCSP((csp) => {
    for (const [key, val] of Object.entries(cspDirectives)) {
      const directive = key as keyof typeof csp.directives;

      if (!csp.directives[directive]) {
        // @ts-ignore this is tricky to do, we can assume it's not directives.reportUri
        csp.directives[directive] = [] as string[];
      }
      // @ts-ignore this is tricky to do, we can assume it's not directives.reportUri
      csp.directives[directive].push(...(val as string[]));
    }
  });
}
