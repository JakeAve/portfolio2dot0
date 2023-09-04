import { Handlers } from "$fresh/server.ts";
import { resendEmail } from "../../utils/resend.ts";

export interface FormFields {
  "g-recaptcha-response": string;
  email: string;
  name: string;
  message: string;
}

interface CaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: "submit";
  "error-codes"?: string[];
}

async function verifyCaptcha(token: string) {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${
    Deno.env.get("CAPTCHA_SECRET_KEY") as string
  }&response=${token}`;
  const resp = await fetch(url, { method: "post" });
  const json = (await resp.json()) as CaptchaResponse;
  if (json["error-codes"] && json["error-codes"].length) {
    throw new Error(json["error-codes"].join(","));
  }
  if (json.score < 0.5) {
    throw new Error(`Invalid Captcha`);
  }
}

async function sendEmail(name: string, email: string, content: string) {
  const myEmail = await resendEmail({
    from: Deno.env.get("FROM_EMAIL") as string,
    to: [Deno.env.get("TO_EMAIL") as string],
    subject: `Inquiry from ${name} on jakesportfolio.dev`,
    html: content + `<br><br>name: ${name}<br><br>email: ${email}`,
  });

  if (!myEmail.ok) {
    const json = await myEmail.json();
    console.error(JSON.stringify(json));
    throw new Error(`My email has error ${myEmail.statusText}`);
  }

  if (email) {
    const clientEmail = await resendEmail({
      from: Deno.env.get("FROM_EMAIL") as string,
      to: [email],
      subject: `Confirmation from jakesportfolio.dev`,
      html: `Thank you for your inquiry ${name || "Whatever your name is"},
      <br><br>
      This is an automatic response from https://www.jakesportfolio.dev/ to confirm your inquiry has been sent to the overlord.
      <br><br>
      Best,
      <br>
      Jake's mail robot
      `,
    });
    if (!clientEmail.ok) {
      const json = await clientEmail.json();
      console.error(JSON.stringify(json));
      throw new Error(`Client email has error ${clientEmail.statusText}`);
    }
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const data = (await req.json()) as FormFields;
      await verifyCaptcha(data["g-recaptcha-response"]);
      const { email, name, message } = data;
      if (Deno.env.get("DENO_ENV") !== "develop") {
        await sendEmail(name, email, message);
      }
      return new Response(JSON.stringify({ message: "ok" }));
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: "error" }), {
        status: 500,
      });
    }
  },
};
