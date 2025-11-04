import OutboundMail from "../models/OutboundMail.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, code) {
  const subject = "Your verification code";
  const text = `Your verification code is ${code}. It expires in 15 minutes.`;
  const html = `
    <div style="font-family:sans-serif;line-height:1.6">
      <h2>Verify your email</h2>
      <p>Use this code to verify your account:</p>
      <div style="font-size:24px;font-weight:bold;border:1px solid #ddd;padding:8px 12px;display:inline-block;border-radius:6px;background:#f9fafb">
        ${code}
      </div>
      <p style="font-size:13px;color:#777">This code expires in 15 minutes.</p>
    </div>
  `;

  await OutboundMail.create({
    to,
    subject,
    text,
    html,
    meta: { provider: "resend", type: "verification" },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[MOCK EMAIL] To: ${to} | Code: ${code}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Task Manager <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
