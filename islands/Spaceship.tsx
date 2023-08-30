import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState, useRef } from "preact/hooks";

export default function Spaceship() {
  const spaceshipRef = useRef<null | HTMLDivElement>(null);
  const [pointerX, setPointerX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const spaceship = spaceshipRef.current as HTMLImageElement;
      const spaceshipRect = spaceship.getBoundingClientRect();
      const spaceshipCenter =
        (spaceshipRect.right - spaceshipRect.left) / 2 + spaceshipRect.left;
      const rotator = spaceship.querySelector(
        "#rotate-container"
      ) as HTMLDivElement;
      if (Math.abs(pointerX - spaceshipCenter) < 3) {
        rotator.style.transform = "rotate(0deg)";
        return;
      }
      if (
        pointerX > spaceshipCenter &&
        spaceshipRect.right < globalThis.innerWidth
      ) {
        spaceship.style.left = spaceshipRect.left + 1 + "px";
        rotator.style.transform = "rotate(10deg)";
      }
      if (pointerX < spaceshipCenter && spaceshipRect.left > 0) {
        spaceship.style.left = spaceshipRect.left - 1 + "px";
        rotator.style.transform = "rotate(-10deg)";
      }
      if (!isPlaying) {
        clearInterval(interval);
        rotator.style.transform = "rotate(0deg)";
      }
    }, 1);
    return () => clearInterval(interval);
  }, [spaceshipRef.current, pointerX, isPlaying]);

  const setXCoor = (e: PointerEvent) => {
    setPointerX(e.x);
  };

  const pointerLeave = () => {
    setIsPlaying(false);
  };

  const pointerEnter = () => {
    setIsPlaying(true);
  };

  const shootLaser = () => {
    const spaceship = spaceshipRef.current as HTMLImageElement;
    const spaceshipRect = spaceship.getBoundingClientRect();
    const spaceshipCenter =
      (spaceshipRect.right - spaceshipRect.left) / 2 + spaceshipRect.left;
    const laser = document.createElement("div");
    laser.classList.add("space-laser");
    laser.style.left = spaceshipCenter + "px";
    spaceship.parentElement?.append(laser);
    setTimeout(() => {
      laser.remove();
    }, 450);
  };

  if (IS_BROWSER) {
    useEffect(() => {
      // @ts-ignore custom event stuff
      const moveEvent = (e) => {
        // @ts-ignore custom event details is fine
        setXCoor(e.detail as number);
      };

      globalThis.addEventListener("spaceship-move", moveEvent);
      globalThis.addEventListener("spaceship-laser", shootLaser);

      return () => {
        globalThis.removeEventListener("spaceship-move", moveEvent);

        globalThis.removeEventListener("spaceship-laser", shootLaser);
      };
    }, [setXCoor]);
  }

  return (
    <div
      id="spaceship-container"
      onPointerMove={setXCoor}
      onPointerLeave={pointerLeave}
      onPointerEnter={pointerEnter}
      onPointerUp={shootLaser}
      onPointerDown={(e) => {
        setXCoor(e);
        shootLaser();
      }}
    >
      <div id="spaceship" ref={spaceshipRef}>
        <div id="rotate-container">
          <img src="/imgs/usa-spaceship-xs.webp" height={50} width={50} />
          <div class="fire-container">
            <div class="red flame"></div>
            <div class="orange flame"></div>
            <div class="yellow flame"></div>
            <div class="white flame"></div>
            <div class="blue circle"></div>
            <div class="black circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
