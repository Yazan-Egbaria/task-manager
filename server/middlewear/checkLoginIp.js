import IpAllowList from "../models/IpAllowList.js";

function normalizeIp(raw) {
  if (!raw) return "";
  const ip = raw.split(",")[0].trim();
  return ip.replace(/^::ffff:/, "");
}

export async function checkLoginIp(req, res, next) {
  try {
    const ip =
      normalizeIp(req.headers["x-forwarded-for"] || "") || normalizeIp(req.ip);

    const allowed = await IpAllowList.findOne({ ip, isActive: true }).lean();

    if (!allowed) {
      return res.status(403).json({
        message: "Login is restricted from your IP. Contact support.",
      });
    }
    next();
  } catch (err) {
    return res
      .status(503)
      .json({ message: "Login temporarily unavailable. Please try later." });
  }
}
