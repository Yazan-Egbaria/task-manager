import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    emailVerifiedAt: { type: Date, default: null },
    failedLoginCount: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

UserSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

UserSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.methods.resetFailedLogin = function resetFailedLogin() {
  this.failedLoginCount = 0;
  this.lockoutUntil = null;
};

UserSchema.methods.incrementFailedLogin = function incrementFailedLogin() {
  this.failedLoginCount = (this.failedLoginCount || 0) + 1;
};

export default mongoose.model("User", UserSchema);
