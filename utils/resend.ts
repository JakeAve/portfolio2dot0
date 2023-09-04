interface ResendEmail {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export function resendEmail(resendEmail: ResendEmail) {
  const { from, to, subject, html } = resendEmail;
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("RESEND_KEY") as string}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });
}
