import mongoose from "mongoose";

const ipAllowListSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true },
    label: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("IpAllowList", ipAllowListSchema);
