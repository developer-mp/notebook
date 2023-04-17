import emailjs from "emailjs-com";

const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID;
const EMAIL_USER_ID = process.env.NEXT_PUBLIC_EMAIL_USER_ID;

export function sendEmail(
  title: string,
  content: string,
  recipientEmail: string
) {
  const templateParams = {
    user_name: "Notebook App",
    user_email: recipientEmail,
    user_subject: title,
    message: content,
    to_email: recipientEmail,
  };
  if (EMAIL_SERVICE_ID && EMAIL_TEMPLATE_ID && EMAIL_USER_ID) {
    emailjs
      .send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_USER_ID)
      .then(
        (result) => {
          console.log(
            "Email sent successfully:",
            (result as { text: string }).text
          );
        },
        (error) => {
          console.log("Error sending email:", (error as { text: string }).text);
        }
      );
  } else {
    throw new Error("Missing environment variables for email service");
  }
}
