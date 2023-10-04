import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App(appProps: AppProps) {
  const { Component } = appProps;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Belgrano&family=Handjet:wght@300&family=Lato:wght@100;300;400&family=Monoton&family=Raleway+Dots&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/animate.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon_io/apple-touch-icon.png" />
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${
            Deno.env.get(
              "CAPTCHA_SITE_KEY",
            )
          }`}
        >
        </script>
        <meta name="description" content="Jake's developer portfolio" />
        <meta name="keywords" content="Jake's developer portfolio" />
        <meta name="author" content="Jake Avery" />
        {/* Facebook Open Graph */}
        <meta property="og:title" content="Jake's Portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jakesportfolio.dev/" />
        <meta
          property="og:image"
          content="/favicon_io/android-chrome-512x512.png"
        />
        {/* Twitter Card */}
        <meta name="twitter:title" content="Jake's Portfolio" />
        <meta name="twitter:description" content="Check out my work" />
        <meta
          name="twitter:image"
          content="/favicon_io/android-chrome-512x512.png"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <Component />
    </>
  );
}
