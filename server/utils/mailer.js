import OutboundMail from "../models/OutboundMail.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
    meta: { provider: "gmail", type: "verification" },
  });

  if (process.env.NODE_ENV === "production") {
    try {
      await transporter.sendMail({
        from: `Task Manager <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  } else {
    console.log(`[MOCK EMAIL] To: ${to} | Code: ${code}`);
    console.log(
      `Check mailbox: http://localhost:4000/api/dev/mailbox?to=${to}`
    );
  }
}
