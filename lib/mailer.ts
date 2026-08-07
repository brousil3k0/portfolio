import nodemailer from "nodemailer";
import { getContactEnv } from "./env";

export function getTransporter() {
  const env = getContactEnv();
  return nodemailer.createTransport({
    host: env.host,
    port: env.port,
    secure: env.port === 465,
    auth: { user: env.user, pass: env.pass },
  });
}
