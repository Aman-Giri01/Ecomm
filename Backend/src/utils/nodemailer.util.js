// import expressAsyncHandler from "express-async-handler";
// import mailTransport from "../config/nodemailer.config.js";

// export const sendEmail = expressAsyncHandler(
//   async (to, subject, text, html) => {
//     const sentMail = await mailTransport.sendMail({
//       from: process.env.NODEMAILER_EMAIL,
//       to,
//       subject,
//       text,
//       html,
//     });
//     console.log(sentMail);
//     return sentMail;
//   }
// );

import expressAsyncHandler from "express-async-handler";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = expressAsyncHandler(
  async (to, subject, text, html) => {
    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_EMAIL, // must be verified in SendGrid
      subject,
      text,
      html,
    };

    try {
      const sentMail = await sgMail.send(msg);
      console.log("✅ Email sent:", sentMail[0].statusCode);
      return sentMail;
    } catch (error) {
      console.error(
        "❌ SendGrid Error:",
        error.response?.body || error.message
      );
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
);