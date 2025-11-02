import mongoose from "mongoose";

const OutboundMailSchema = new mongoose.Schema(
  {
    to: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    text: { type: String, default: "" },
    html: { type: String, default: "" },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

OutboundMailSchema.index({ to: 1, createdAt: -1 });

export default mongoose.model("OutboundMail", OutboundMailSchema);
