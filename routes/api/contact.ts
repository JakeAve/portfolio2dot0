import { Handlers } from "$fresh/server.ts";
import { SmtpClient } from "smpt";

interface FormFields {
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
  const client = new SmtpClient();

  console.log(Deno.env.get("EMAIL_PASSWORD") as string);

  await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 465,
    username: Deno.env.get("EMAIL_USERNAME") as string,
    password: Deno.env.get("EMAIL_PASSWORD") as string,
  });

  await client.send({
    from: Deno.env.get("FROM_EMAIL") as string,
    to: Deno.env.get("TO_EMAIL") as string,
    subject: `Inquiry from ${name} on jakesportfolio.dev`,
    content: content + `<br><br>name: ${name}<br><br>email: ${email}`,
  });

  await client.send({
    from: Deno.env.get("FROM_EMAIL") as string,
    to: email,
    subject: `Confirmation from jakesportfolio.dev`,
    content: `Thank you for your inquiry ${name || "Whatever your name is"},
    <br><br>
    This is an automatic response from https://www.jakesportfolio.dev/ to confirm your inquiry has been sent to the overlord.
    <br><br>
    Best,
    <br>
    Jake's mail robot
    `,
  });

  await client.close();
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
