import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/*
 * Section 11 — a mail failure is logged and the enquiry is still saved.
 * If SMTP is not configured the patient still gets a success response.
 */

let transporter = null;

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendContactNotification({ name, email, phone, message }) {
  const mailer = getTransporter();
  if (!mailer) {
    logger.warn("SMTP is not configured; the contact email was not sent.");
    return false;
  }

  try {
    await mailer.sendMail({
      from: `Sakthi Dental Clinic website <${env.SMTP_USER}>`,
      to: env.MAIL_TO,
      replyTo: email,
      subject: `New website enquiry from ${name}`,
      text: [
        "A new message came through the Sakthi Dental Clinic website.",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        "",
        "Message:",
        message || "(no message)",
      ].join("\n"),
    });
    return true;
  } catch (error) {
    logger.error({ err: error }, "The contact email could not be sent.");
    return false;
  }
}
