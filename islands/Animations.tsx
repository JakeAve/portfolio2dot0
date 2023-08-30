import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Animations() {
  if (IS_BROWSER) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elem = entry.target as HTMLElement;
            const animation = elem.dataset.animation as string;
            elem.style.opacity = "";
            elem.classList.add("opacity-1");
            elem.classList.add("animate__delay-1s");
            elem.classList.add("animate__animated");
            elem.classList.add(animation);
            observer.unobserve(elem);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-animation]").forEach((e) => {
      const elem = e as HTMLElement;
      observer.observe(elem);
      elem.style.opacity = "0";
    });
  }

  return <></>;
}
