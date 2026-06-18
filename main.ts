import { loadSync } from "@std/dotenv";

loadSync({ export: true });

import { App, staticFiles, trailingSlashes } from "fresh";

export const app = new App()
  .use(staticFiles())
  .use(trailingSlashes("never"));

app.fsRoutes();

if (import.meta.main) {
  await app.listen();
}
