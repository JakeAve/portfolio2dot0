import { useRef } from "preact/hooks";
import { JSX } from "preact";
import { useState } from "preact/hooks";

interface ContactFormProps {
  captchaSiteKey: string;
}

export default function ContactForm(props: ContactFormProps) {
  const { captchaSiteKey } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const captchaRef = useRef<HTMLInputElement | null>(null);

  const sendForm = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    await populatCaptchaToken();
    const target = e.target as HTMLFormElement;
    const form = target.closest("form") as HTMLFormElement;
    setIsDisabled(true);
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }
    const resp = await fetch("/api/contact", {
      method: "post",
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      setIsError(true);
      console.error("error error");
      setIsDisabled(false);
      return;
    }
    setIsSubmitted(true);
    console.log("success");
  };

  const populatCaptchaToken = () => {
    return new Promise<void>((res, rej) => {
      // @ts-ignore the google captcha stuff
      grecaptcha.ready(() => {
        // @ts-ignore the google captcha stuff
        grecaptcha
          .execute(captchaSiteKey, {
            action: "submit",
          })
          .then((token: string) => {
            const captchaInput = captchaRef.current as HTMLInputElement;
            captchaInput.value = token;
            res();
          })
          .catch(rej);
      });
    });
  };

  const FormContent = () => (
    <form
      onSubmit={sendForm}
      class="w-full text-xl grid gap-2 md:gap-4 justify-stretch"
    >
      <input
        id="g-recaptcha-response"
        name="g-recaptcha-response"
        type="hidden"
        ref={captchaRef}
      />
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        maxLength={100}
        class="px-4 py-2 bg-gray-100 disabled:opacity-20 bg-opacity-50 rounded-md"
        disabled={isDisabled}
      />
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        class="px-4 py-2 bg-gray-100 disabled:opacity-20 bg-opacity-50 rounded-md"
        disabled={isDisabled}
      />
      <label for="message">Message *</label>
      <textarea
        id="message"
        name="message"
        maxLength={1000}
        class="px-4 py-2 bg-gray-100 disabled:opacity-20 h-28 bg-opacity-50 rounded-md"
        disabled={isDisabled}
        required
      ></textarea>
      <button
        type="submit"
        class="px-16 py-2 bg-gray-900 disabled:opacity-20 bg-opacity-50 justify-self-center rounded-md"
        disabled={isDisabled}
      >
        Send
      </button>
      <p class="text-sm text-center">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          class="underline"
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          class="underline"
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener"
        >
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </form>
  );

  const SuccessMessage = () => {
    return (
      <div class="p-6 border-2 border-dotted rounded-md divide-white">
        <p class="text-xl text-center">🎊🎉 Success! 🎉🎊</p>
        <p class="text-xl text-center">
          I hope to be in touch with you shortly 😄
        </p>
      </div>
    );
  };

  const content = isSubmitted ? <SuccessMessage /> : <FormContent />;

  return <div class="w-full">{content}</div>;
}
