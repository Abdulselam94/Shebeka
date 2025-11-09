import { Resend } from "resend";
import { env } from "./env.js";

export const resend = new Resend(process.env.RESEND_API_KEY);
