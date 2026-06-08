import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}
