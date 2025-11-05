import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sha256, inMinutes } from "../utils/crypto.js";
import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js";
import { requireAuth } from "../middlewear/auth.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const router = Router();

// Signup api
router.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists)
    return res.status(400).json({ message: "Email is already registered" });

  const u = new User({ email });
  await u.setPassword(password);
  await u.save();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await VerificationCode.create({
    userId: u._id,
    codeHash: sha256(code),
    expiresAt: inMinutes(15),
  });

  const emailJob = sendVerificationEmail(email, code).catch((err) =>
    console.error("Email send failed:", err?.message || err)
  );
  const MAX_WAIT_MS = 800;
  await Promise.race([
    emailJob,
    new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
  ]);

  return res.status(201).json({
    ok: true,
    message: "Signup successful, Check your email for verification code.",
  });
});

// Verify api
router.post("/verify", async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(400).json({ message: "Invalid email or code" });

  const rec = await VerificationCode.findOne({ userId: user._id }).sort({
    createdAt: -1,
  });
  if (!rec || rec.expiresAt < new Date())
    return res.status(400).json({ message: "Code expired" });
  if (rec.codeHash !== sha256(code))
    return res.status(400).json({ message: "Invalid code" });

  user.emailVerifiedAt = new Date();
  await user.save();

  return res.json({ ok: true, message: "Email verified" });
});

// Resend verification code
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.emailVerifiedAt)
    return res.status(400).json({ message: "Email already verified" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await VerificationCode.create({
    userId: user._id,
    codeHash: sha256(code),
    expiresAt: inMinutes(15),
  });

  const emailJob = sendVerificationEmail(email, code).catch((err) =>
    console.error("Email send failed:", err?.message || err)
  );
  const MAX_WAIT_MS = 800;
  await Promise.race([
    emailJob,
    new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
  ]);

  return res.json({
    ok: true,
    message: "Verification code sent",
  });
});

// Login api
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user)
    return res.status(401).json({ message: "Email or password are incorrect" });

  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const secondsLeft = Math.ceil((user.lockoutUntil - new Date()) / 1000);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return res.status(403).json({
      message: `Locked. Try again in ${minutes}m ${seconds}s`,
    });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    user.incrementFailedLogin();
    if (user.failedLoginCount >= 3) {
      user.lockoutUntil = inMinutes(2);
      user.failedLoginCount = 0;
    }
    await user.save();
    return res.status(401).json({ message: "Email or password are incorrect" });
  }

  if (!user.emailVerifiedAt)
    return res.status(403).json({ message: "Email not verified" });

  user.resetFailedLogin();
  await user.save();

  const payload = { subject: String(user._id), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "7d",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return res.json({ ok: true });
});

// Logout api
router.post("/logout", async (_req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  return res.status(204).end();
});

// Me api
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("email");
  res.json(user);
});

export default router;
