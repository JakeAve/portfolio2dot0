import { IS_BROWSER } from "$fresh/runtime.ts";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Cube() {
  if (IS_BROWSER) {
    let groundColor =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? 0xb45309
        : 0xfde68a;

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        groundColor = newColorScheme === "dark" ? 0xb45309 : 0xfde68a;
        ground.material = new THREE.MeshLambertMaterial({
          color: groundColor,
          side: THREE.DoubleSide,
        });
      });

    const cubeElement = document.querySelector(
      "#the-cube"
    ) as HTMLCanvasElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      cubeElement.clientWidth / cubeElement.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 5.5804, 7);
    const cameraPivot = new THREE.Object3D();
    cameraPivot.position.set(0, 3, 0);
    cameraPivot.add(camera);
    cameraPivot.rotateX(0.3);
    scene.add(cameraPivot);

    const renderer = new THREE.WebGLRenderer({
      canvas: cubeElement,
      alpha: true,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setPixelRatio(1);

    const wizardTexture = new THREE.TextureLoader().load("./imgs/wizard.jpeg");
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const geometry = new THREE.SphereGeometry(1, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      map: wizardTexture,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.translateY(3);
    scene.add(cube);
    cube.castShadow = true;

    const iconTextures = [
      new THREE.TextureLoader().load("./imgs/react.png"),
      new THREE.TextureLoader().load("./imgs/html.png"),
      new THREE.TextureLoader().load("./imgs/css.png"),
      new THREE.TextureLoader().load("./imgs/node.png"),
      new THREE.TextureLoader().load("./imgs/typescript.png"),
      new THREE.TextureLoader().load("./imgs/git.png"),
      new THREE.TextureLoader().load("./imgs/aws.png"),
      new THREE.TextureLoader().load("./imgs/kubernetes.png"),
      new THREE.TextureLoader().load("./imgs/docker.png"),
      new THREE.TextureLoader().load("./imgs/mongodb.png"),
    ];

    interface Pivot {
      pivot: THREE.Object3D;
      y: number;
      sign: -1 | 1;
    }

    interface Planet {
      planet: THREE.Mesh;
      y: number;
      sign: -1 | 1;
    }

    const pivots: Pivot[] = [];
    const planets: Planet[] = [];

    for (let i = 0; i < iconTextures.length; i++) {
      const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const sphereTex = iconTextures[i];
      sphereTex.wrapS = sphereTex.wrapT = THREE.RepeatWrapping;
      sphereTex.repeat.set(2, 1);
      const material = new THREE.MeshStandardMaterial({
        map: sphereTex,
      });

      const sphere = new THREE.Mesh(sphereGeo, material);
      sphere.castShadow = true;

      const pivot = new THREE.Object3D();
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

    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.MeshLambertMaterial({
      color: groundColor,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = Math.PI * -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);

    const pointLight = new THREE.PointLight(0xffffff, 35);
    pointLight.castShadow = true;
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight, ambientLight);

    const secondLight = new THREE.PointLight(0xffffff, 3);
    secondLight.position.set(0, 3, 0);
    scene.add(secondLight);

    const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    const controls = new OrbitControls(
      camera as THREE.Camera,
      renderer.domElement
    );
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.keyPanSpeed = 0.05;
    controls.rotateSpeed = 0.05;
    controls.enableZoom = false;
    controls.target = new THREE.Vector3(0, 3, 0);
    controls.update();

    // const gridHelper = new THREE.GridHelper(200, 200);
    // scene.add(gridHelper);
    // const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    // scene.add(cameraHelper);
    // const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper);
    // const secondLightHelper = new THREE.PointLightHelper(secondLight);
    // scene.add(secondLightHelper);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
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
      controls.target.set(0, 3, 0);
    };
    render();
  }

  return (
    <>
      <canvas id="the-cube"></canvas>
    </>
  );
}
