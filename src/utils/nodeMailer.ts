import nodemailer from "nodemailer";

const validateEnv = () => {
  switch (true) {
    case !process.env.SMTP_HOST:
      throw new Error("SMTP_HOST Not Found !");

    case !process.env.SMTP_PORT:
      throw new Error("SMTP_PORT Not Found !");

    case !process.env.SMTP_USER:
      throw new Error("SMTP_USER Not Found !");

    case !process.env.SMTP_PASS:
      throw new Error("SMTP_PASS Not Found !");

    case !process.env.EMAIL_FROM:
      throw new Error("EMAIL_FROM Not Found !");

    default:
      return true;
  }
};

const SendEmail = async (to: string, subject: string, html: string) => {
  try {

    validateEnv();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM!,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default SendEmail;
