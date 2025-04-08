import { useRef } from "preact/hooks";
import { CarouselSec, CarouselSecProps } from "../components/CarouselSec.tsx";

const sections: CarouselSecProps[] = [
  {
    alt: "Blog",
    caption: "Jake's Blog",
    href: "https://blog.jakesportfolio.dev/",
    linkText: "blog.jakesportfolio.dev",
    srcName: "/portfolio-screenshots/blog",
  },
  {
    alt: "Evercast",
    caption: "Evercast",
    href: "https://www.evercast.us/",
    linkText: "Evercast.us",
    srcName: "/portfolio-screenshots/evercast-small",
  },
  {
    alt: "Mezmorizer",
    caption: "Memorizer App",
    href: "https://mezmorizer.deno.dev/",
    linkText: "mezmorizer.deno.dev",
    srcName: "/portfolio-screenshots/mezmorizer",
  },
  {
    alt: "Synthima Password",
    caption: "Synthima Password",
    href: "https://synthima-password.deno.dev/",
    linkText: "synthima-password.deno.dev",
    srcName: "/portfolio-screenshots/password-generator",
  },
  {
    alt: "Bingasaurus app",
    caption: "Bingasaurus app",
    href: "https://github.com/JakeAve/bingasaurus",
    linkText: "github.com/JakeAve/bingasaurus",
    srcName: "/portfolio-screenshots/bingasaurus",
  },
  {
    alt: "ComeUntoChrist.org",
    caption: "ComeUntoChrist.org",
    href: "https://www.churchofjesuschrist.org/comeuntochrist",
    linkText: "ComeUntoChrist.org",
    srcName: "/portfolio-screenshots/comeuntochrist",
  },
  {
    alt: "Text Compare",
    caption: "Text Compare",
    href: "https://scripturecompare.org/",
    linkText: "ScriptureCompare.org",
    srcName: "/portfolio-screenshots/text-compare",
  },
  {
    alt: "Teh Bots News",
    caption: "Teh Bots News",
    href: "https://tehbots.news/",
    linkText: "TehBots.news",
    srcName: "/portfolio-screenshots/tehbotsnews",
  },
  {
    alt: "tic-tac-toe",
    caption: "tic-tac-toe",
    href: "https://jakeave.github.io/tic-tac-toe/",
    linkText: "jakeave.github.io/tic-tac-toe/",
    srcName: "/portfolio-screenshots/tic-tac-toe",
  },
  {
    alt: "GL Link",
    caption: "GL Link",
    href: "https://gospellibrary.link/",
    linkText: "gospellibrary.link",
    srcName: "/portfolio-screenshots/gl-link",
  },
  {
    alt: "Real Time Strategies",
    caption: "Real Time Strategies",
    href: "https://www.spacetime.gg/",
    linkText: "realtimestrat.com",
    srcName: "/portfolio-screenshots/realtimestrat",
  },
  {
    alt: "Rush Restoration",
    caption: "Rush Restoration",
    href: "https://jakeave.github.io/rush-restoration-preview/",
    linkText: "jakeave.github.io/rush-restoration-preview",
    srcName: "/portfolio-screenshots/rush-restoration-small",
  },
  {
    alt: "Young Living Knowledge Base",
    caption: "Young Living Knowledge Base",
    href:
      "https://www.exteriores.gob.es/Consulados/losangeles/en/Paginas/index.aspx",
    linkText: "youngliving.com",
    srcName: "/portfolio-screenshots/ylknowledgebase-medium",
  },
  {
    alt: "Consulate of Spain in Los Angeles",
    caption: "Conosulate of Spain",
    href:
      "https://www.exteriores.gob.es/Consulados/losangeles/en/Paginas/index.aspx",
    linkText: "exteriores.gob.es",
    srcName: "/portfolio-screenshots/consulate",
  },
];

export default function Carousel() {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: PointerEvent) => {
    const event = new CustomEvent("spaceship-move", {
      detail: e as PointerEvent,
    });
    globalThis.dispatchEvent(event);
  };

  const handlePointerUp = () => {
    const spaceshipLaserEvent = new Event("spaceship-laser");
    globalThis.dispatchEvent(spaceshipLaserEvent);
  };

  const handlePointerDown = (e: PointerEvent) => {
    const spaceshipLaserEvent = new Event("spaceship-laser");
    const event = new CustomEvent("spaceship-move", {
      detail: e as PointerEvent,
    });
    globalThis.dispatchEvent(event);
    globalThis.dispatchEvent(spaceshipLaserEvent);
  };

  const scrollBefore = () => {
    sliderRef.current?.scrollBy({ behavior: "smooth", left: -500 });
  };
  const scrollNext = () => {
    sliderRef.current?.scrollBy({ behavior: "smooth", left: 500 });
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      data-animation="animate__bounceInUp"
      style={{ opacity: 0 }}
    >
      <button
        onClick={scrollBefore}
        class="absolute z-10 hidden bg-gray-900 rounded-full bg-opacity-90 md:block md:left-8 lg:left-24 top-1/2 transform translate-y-full"
        aria-label="previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
          fill="#F3F4F6"
        >
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
      </button>
      <div
        id="slider-1"
        class="relative px-8 pt-4 pb-6 mx-auto mt-6 md:pt-12 slider gap-8 md:gap-12 md:px-12 lg:gap-16 lg:px-24"
        ref={sliderRef}
      >
        {sections.map((sec) => <CarouselSec {...sec} />)}
      </div>
      <button
        onClick={scrollNext}
        class="absolute z-10 hidden bg-gray-900 rounded-full bg-opacity-90 md:block md:right-8 lg:right-24 top-1/2 transform translate-y-full"
        aria-label="next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
          fill="#F3F4F6"
        >
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>
      </button>
    </div>
  );
}
