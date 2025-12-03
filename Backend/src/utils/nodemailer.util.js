import expressAsyncHandler from "express-async-handler";
import mailTransport from "../config/nodemailer.config.js";

export const sendEmail = expressAsyncHandler(
  async (to, subject, text, html) => {
    const sentMail = await mailTransport.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });
    console.log(sentMail);
    return sentMail;
  }
);
