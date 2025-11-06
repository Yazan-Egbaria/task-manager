import { Router } from "express";
import IpAllowList from "../models/IpAllowList.js";

const router = Router();

router.get("/ip-allowlist", async (_req, res) => {
  const list = await IpAllowList.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post("/ip-allowlist", async (req, res) => {
  const { ip, label } = req.body || {};
  if (!ip) return res.status(400).json({ message: "IP required" });
  const doc = await IpAllowList.findOneAndUpdate(
    { ip },
    { ip, label, isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(doc);
});

router.delete("/ip-allowlist/:id", async (req, res) => {
  await IpAllowList.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
