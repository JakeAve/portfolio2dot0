import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getCount, setCount } from "../utils/db.ts";
import { FullHeightSection } from "../components/FullHeightSection.tsx";
import Cube from "../islands/Cube.tsx";
import Carousel from "../islands/Carousel.tsx";
import { Stars } from "../components/Stars.tsx";
import { Footer } from "../components/Footer.tsx";
import { SocialIcons } from "../components/SocialIcons.tsx";
import Animations from "../islands/Animations.tsx";
import { SkillsListItem } from "../components/SkillsListItem.tsx";
import ContactForm from "../islands/ContactForm.tsx";
import PageLoading from "../islands/PageLoading.tsx";
import { setCSP } from "../csp.ts";

interface HomeProps {
  start: number;
}

export const handler: Handlers<HomeProps> = {
  async GET(_req, ctx) {
    let start = await getCount();
    if (start === null) start = 1;
    setCount(start + 1);
    return ctx.render();
  },
};

export default function Home(_props: PageProps<HomeProps>) {
  setCSP();
  return (
    <>
      <Head>
        <title>Jake's Portfolio</title>
      </Head>
      <main>
        <FullHeightSection
          class="relative flex items-center justify-center bg-transparent isolate dark:bg-gray-800 first-sec"
          data-content="╲╱"
        >
          <SocialIcons />
          <h1 class="items-center content-center h-full max-w-4xl m-auto text-gray-900 box-border text-9xl grid dark:text-gray-100">
            <span class="animate__animated animate__zoomInDown animate__delay-1s text-8xl md:text-9xl font-retro justify-self-stretch">
              Hello,
            </span>
            <span class="animate__animated animate__zoomInUp animate__delay-1s font-techno justify-self-center">
              I'm
            </span>
            <span class="animate__animated animate__zoomInRight animate__delay-1s font-display justify-self-end">
              Jake
            </span>
          </h1>
          <div class="w-32 h-32 bg-yellow-300 md:w-64 md:h-64 animate-square-1 mix-blend-color-dodge"></div>
          <div class="w-40 h-40 bg-yellow-400 rounded-full md:h-80 md:w-80 animate-circle-1 mix-blend-color-dodge"></div>
          <pre class="absolute bottom-0 right-0 p-4 text-gray-400 dark:text-gray-600 text-xs whitespace-pre-wrap break-words">
            PGP Fingerprint: 20C8 F929 9F59 0004 0E48 C12C 454F 0481 E4D4 017F
          </pre>
        </FullHeightSection>
        <FullHeightSection class="relative text-gray-800 bg-yellow-200 dark:bg-yellow-700 dark:text-gray-50 who-i-am-sec">
          <Cube />
          <h2
            id="who_i_am"
            data-animation="animate__fadeInLeft"
            class="inline-block px-4 py-2 text-red-600 rounded dark:mix-blend-overlay dark:bg-gray-900  bg-opacity-20 who-i-am-title text-7xl md:text-8xl dark:text-red-50 font-retro backdrop-filter backdrop-blur"
          >
            Who I am
          </h2>
          <p
            data-animation="animate__fadeInRight"
            class="px-4 py-2 my-4 text-3xl bg-gray-100 rounded max-w-screen-md md:text-4xl bg-opacity-20 dark:bg-gray-900 backdrop-filter backdrop-blur dark:mix-blend-overlay"
          >
            I'm a full-stack Javascript developer with a background in business,
            media and SAAS. I have experience in the following technologies:
          </p>
          <ul class="flex flex-row flex-wrap py-2 my-4 gap-2 max-w-screen-md">
            {[
              "AWS",
              "CSS",
              "CircleCI",
              "Deno",
              "Docker",
              "DynamoDB",
              "ExpressJS",
              "Electron",
              "Git",
              "GraphQL",
              "HTML",
              "Jest",
              "Kubernetes",
              "Mocha",
              "MongoDB",
              "Next.js",
              "Node.js",
              "Postgres",
              "React",
              "REDUX",
              "RESTful APIs",
              "SASS",
              "Socket.io",
              "Svelte",
              "THREE JS",
              "Tailwind",
              "Typescript",
              "WebRTC",
              "Web3",
            ].map((text) => (
              <SkillsListItem text={text} />
            ))}
          </ul>
        </FullHeightSection>
        <FullHeightSection class="relative overflow-x-visible bg-gray-900">
          <Stars />
          <h2
            id="what_i_do"
            data-animation="animate__lightSpeedInRight"
            class="relative flex text-gray-100 pointer-events-none md:text-9xl text-8xl font-techno"
          >
            What I do
          </h2>
          <p
            data-animation="animate__lightSpeedInLeft"
            class="relative mt-4 text-xl text-gray-100 pointer-events-none md:mt-6 max-w-screen-md md:text-3xl"
          >
            I breathe life into your ideas. I've worked on projects ranging from
            video conferencing to games to commerce. Take a look at some of my
            projects.
          </p>
          <Carousel />
        </FullHeightSection>
        <FullHeightSection class="relative">
          <video
            class="absolute top-0 left-0 z-0 object-cover w-full h-full brightness-50 contrast-75"
            src="/videos/sea-960x540.mp4"
            controls={false}
            autoPlay
            loop
            playsInline
            muted
          />
          <div
            data-animation="animate__flipInX"
            class="items-center justify-center p-8 pb-8 m-auto mb-16 text-gray-100 bg-gray-900 max-w-screen-md glass-form justify-items-center grid rounded-md gap-4 md:gap-8 backdrop-filter backdrop-blur backdrop-brightness-75 "
          >
            <h2
              id="lets_link_up"
              class="text-gray-100 text-6xl md:text-8xl lg:text-9xl font-display mix-blend-color-dodge"
            >
              Let's link up
            </h2>
            <p class="text-lg md:text-xl">
              Reach out to me, let me know about your idea, and how to contact
              you (I won't spam you).
            </p>
            <ContactForm
              captchaSiteKey={Deno.env.get("CAPTCHA_SITE_KEY") as string}
            />
          </div>
        </FullHeightSection>
        <Footer />
      </main>
      <Animations />
      <PageLoading />
    </>
  );
}

export const config: RouteConfig = {
  csp: true,
};
