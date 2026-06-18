import { load } from "@std/dotenv";

await load({ export: true });

// 3D textures for the Cube island. The source art is ~1000px square, but
// these only ever render on a small cube / tiny spheres, so we downsize to
// power-of-two webp to cut download size, decode time, and GPU memory.
const DIR = "./static/imgs";

const textures: { name: string; size: number }[] = [
  { name: "wizard.jpeg", size: 512 },
  { name: "react.png", size: 256 },
  { name: "html.png", size: 256 },
  { name: "css.png", size: 256 },
  { name: "node.png", size: 256 },
  { name: "typescript.png", size: 256 },
  { name: "git.png", size: 256 },
  { name: "aws.png", size: 256 },
  { name: "kubernetes.png", size: 256 },
  { name: "docker.png", size: 256 },
  { name: "mongodb.png", size: 256 },
];

const CWEBP_PATH = Deno.env.get("CWEBP_PATH") as string;

if (!CWEBP_PATH) {
  console.error("CWEBP_PATH is not set in your environment (.env).");
  Deno.exit(1);
}

async function convert({ name, size }: { name: string; size: number }) {
  const src = `${DIR}/${name}`;
  const out = `${DIR}/${name.replace(/\.\w+$/, ".webp")}`;
  const cmd = new Deno.Command(CWEBP_PATH, {
    args: [
      "-q",
      "80",
      "-resize",
      String(size),
      "0",
      src,
      "-o",
      `${Deno.cwd()}/${out}`,
    ],
  });
  const { code, stderr } = await cmd.output();
  if (code !== 0) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`${name}: ${error}`);
  }
  return out;
}

const results = await Promise.allSettled(textures.map(convert));

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(`✓ ${result.value}`);
  } else {
    console.error(`✗ ${result.reason}`);
  }
}
