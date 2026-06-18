import { useEffect, useRef } from "preact/hooks";

export default function Cube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let teardown: (() => void) | undefined;
    let cancelled = false;

    // Defer loading three.js (~130 kB gzipped) until the cube is about to
    // be seen, so it never blocks initial page load. `import()` also splits
    // three.js into its own on-demand chunk.
    const start = async () => {
      const { initScene } = await import("./cube/scene.ts");
      if (cancelled) return;
      teardown = initScene(canvas);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, { rootMargin: "200px" });
    observer.observe(canvas);

    return () => {
      cancelled = true;
      observer.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <>
      <canvas id="the-cube" ref={canvasRef}></canvas>
    </>
  );
}
