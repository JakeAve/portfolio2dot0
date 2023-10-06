/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { loadSync } from "$std/dotenv/mod.ts";

loadSync({ export: true });

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

const PORT = Deno.env.get("PORT") as string;

await start(manifest, {
  plugins: [twindPlugin(twindConfig)],
  port: Number(PORT) || 8000,
});
