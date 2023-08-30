import { ResponsiveImg } from "./ResponsiveImg.tsx";

export interface CarouselSecProps {
  srcName: string;
  alt: string;
  href: string;
  linkText: string;
  caption: string;
}

export function CarouselSec(props: CarouselSecProps) {
  const { alt, caption, href, linkText, srcName } = props;
  return (
    <div class="flex flex-col items-center gap-2">
      <figure>
        <ResponsiveImg srcName={srcName} alt={alt} class="" />
        <figcaption class="mt-2 text-lg text-center text-gray-100">
          {caption}
        </figcaption>
      </figure>
      <a
        class="flex items-center justify-center text-lg text-gray-100 underline gap-2"
        href={href}
        target="_blank"
        rel="noopener"
        title={caption}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill="#F3F4F6"
        >
          <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
        </svg>
        {linkText}
      </a>
    </div>
  );
}
