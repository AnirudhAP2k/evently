"use server";

import nodemailer from "nodemailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SMTP_TRANSPORTER_SERVICE = process.env.SMTP_TRANSPORTER_SERVICE;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: SMTP_TRANSPORTER_SERVICE,
  host: SMTP_SERVER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  html?: string;
}) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, error);
    return null;
  }

  const info = await transporter.sendMail({
    from: email,
    to: sendTo,
    subject: subject,
    html: html || '',
  });

  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', sendTo);
  return info;
}