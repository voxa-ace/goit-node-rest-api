import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Click the link to verify your email: ${verificationLink}`,
    html: `<p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};
