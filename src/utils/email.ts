import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";



export const sendEmail = async ({
  name,
  email,
  subject,
  html,
  text
}: {
  name: string;
  email: string;
  subject: string;
  html: string;
  text: string;
}) => {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const senderEmail = process.env.MAILERSEND_EMAIL;

  if (!apiKey) {
    throw new Error("API key not found");
  }

  try {
    const mailerSend = new MailerSend({
      apiKey
    });

    const sentFrom = new Sender(`alert@${senderEmail}`, "Event Manager");
    const recipients = [new Recipient(email, name)];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html)
      .setText(text);

    const response = await mailerSend.email.send(emailParams)
    return { response };
  } catch (error) {
    return { error };
  }
}