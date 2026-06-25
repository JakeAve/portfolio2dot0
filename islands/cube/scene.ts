import {
  AmbientLight,
  BasicShadowMap,
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from "three";

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Pivot {
  pivot: Object3D;
  y: number;
  sign: -1 | 1;
}

interface Planet {
  planet: Mesh;
  y: number;
  sign: -1 | 1;
}

/**
 * Builds the cube scene on the given canvas and starts rendering.
 * Returns a teardown function that stops the render loop and releases
 * all GPU/DOM resources — call it when the canvas is removed.
 */
export function initScene(canvas: HTMLCanvasElement): () => void {
  const darkMedia = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
  let groundColor = darkMedia?.matches ? 0xb45309 : 0xfde68a;

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    1,
    1000,
  );
  camera.position.set(0, 5.5804, 7);
  const cameraPivot = new Object3D();
  cameraPivot.position.set(0, 3, 0);
  cameraPivot.add(camera);
  cameraPivot.rotateX(0.3);
  scene.add(cameraPivot);

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = BasicShadowMap;
  renderer.setPixelRatio(1);

  const textureLoader = new TextureLoader();

  const wizardTexture = textureLoader.load("./imgs/wizard.webp");
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({
    map: wizardTexture,
  });
  const cube = new Mesh(geometry, material);
  cube.translateY(3);
  scene.add(cube);
  cube.castShadow = true;

  const iconTextures = [
    "./imgs/react.webp",
    "./imgs/html.webp",
    "./imgs/css.webp",
    "./imgs/node.webp",
    "./imgs/typescript.webp",
    "./imgs/git.webp",
    "./imgs/aws.webp",
    "./imgs/kubernetes.webp",
    "./imgs/docker.webp",
    "./imgs/mongodb.webp",
  ].map((src) => textureLoader.load(src));

  const pivots: Pivot[] = [];
  const planets: Planet[] = [];

  for (let i = 0; i < iconTextures.length; i++) {
    const sphereGeo = new SphereGeometry(0.25, 16, 16);
    const sphereTex = iconTextures[i];
    sphereTex.wrapS = sphereTex.wrapT = RepeatWrapping;
    sphereTex.repeat.set(2, 1);
    const sphereMaterial = new MeshStandardMaterial({
      map: sphereTex,
    });

    const sphere = new Mesh(sphereGeo, sphereMaterial);
    sphere.castShadow = true;

    const pivot = new Object3D();
    pivot.position.set(0, 3, 0);
    pivot.add(sphere);

    sphere.position.set(1.2 + i * 0.55, 0, getRandomNumber(0, 1));
    pivot.rotateX(getRandomNumber(-0.4, 0.4));

    scene.add(pivot);

    pivots.push({
      pivot,
      y: getRandomNumber(0.03, 0.05),
      sign: Math.random() < 0.5 ? -1 : 1,
    });

    planets.push({
      planet: sphere,
      y: getRandomNumber(0.01, 0.04),
      sign: Math.random() < 0.5 ? -1 : 1,
    });
  }

  const groundGeo = new PlaneGeometry(40, 40);
  const groundMat = new MeshLambertMaterial({
    color: groundColor,
    side: DoubleSide,
  });

  const ground = new Mesh(groundGeo, groundMat);
  ground.rotation.x = Math.PI * -0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Swap the ground color when the system theme changes. Registered after
  // `ground` exists so it never references it before definition.
  const handleColorSchemeChange = (event: MediaQueryListEvent) => {
    groundColor = event.matches ? 0xb45309 : 0xfde68a;
    ground.material = new MeshLambertMaterial({
      color: groundColor,
      side: DoubleSide,
    });
  };
  darkMedia?.addEventListener("change", handleColorSchemeChange);

  const ambientLight = new AmbientLight(0xffffff, 2.5);

  const pointLight = new PointLight(0xffffff, 35);
  pointLight.castShadow = true;
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight, ambientLight);

  const secondLight = new PointLight(0xffffff, 3);
  secondLight.position.set(0, 3, 0);
  scene.add(secondLight);

  const resizeRendererToDisplaySize = (renderer: WebGLRenderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  };

  // Lightweight drag-to-rotate in place of OrbitControls (which would pull the
  // whole addon into the bundle). Dragging tilts/spins the camera pivot; the
  // render loop keeps auto-orbiting on top of whatever offset the user sets.
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  const DRAG_SPEED = 0.005;
  const MAX_TILT = 1.2;

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    cameraPivot.rotation.y += dx * DRAG_SPEED;
    cameraPivot.rotation.x = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, cameraPivot.rotation.x + dy * DRAG_SPEED),
    );
  };
  const onPointerUp = (e: PointerEvent) => {
    dragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  let frameId = 0;
  const render = () => {
    frameId = requestAnimationFrame(render);
    cube.rotation.y += 0.001;
    cube.rotation.z += 0.001;
    pivots.forEach((pivot) => {
      pivot.pivot.rotation.y += pivot.y * pivot.sign;
    });
    planets.forEach((planet) => {
      planet.planet.rotation.y += planet.y * planet.sign;
    });
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    cameraPivot.rotation.y += 0.005;
    // Keep the camera aimed at the center cube while the pivot orbits it —
    // this is what OrbitControls used to do on every update(). lookAt reads the
    // camera's world matrix, so refresh the pivot's transform first or the aim
    // lags a frame behind the orbit and wobbles.
    cameraPivot.updateMatrixWorld(true);
    camera.lookAt(0, 3, 0);
    renderer.render(scene, camera);
  };
  render();

  return () => {
    cancelAnimationFrame(frameId);
    darkMedia?.removeEventListener("change", handleColorSchemeChange);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    scene.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        const mat = obj.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    });
    wizardTexture.dispose();
    iconTextures.forEach((t) => t.dispose());
    renderer.dispose();
  };
}
