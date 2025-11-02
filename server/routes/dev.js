import { Router } from "express";
import OutboundMail from "../models/OutboundMail.js";

const router = Router();

router.get("/mailbox", async (req, res) => {
  if (process.env.NODE_ENV === "development") {
    return res.status(403).json({ message: "Mailbox disabled in development" });
  }

  const { to, limit = 10 } = req.query;
  const query = to ? { to } : {};
  const mails = await OutboundMail.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({ count: mails.length, mails });
});

export default router;
