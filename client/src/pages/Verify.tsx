import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import { toast } from "react-toastify";

export default function Verify() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState<string>(loc?.state?.email || "");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/verify", { email, code });
      toast.success("Email verified. You can now log in.");
      navigate("/login", { state: { email } });
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setMsg("");
    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification code sent!");
      setResendTimer(60);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Failed to resend code");
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-semibold">Verify your email</h1>
      <p className="mb-4 text-sm text-gray-600">
        Enter the 6-digit code sent to your email
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          disabled
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-2 text-center text-xl tracking-widest"
          placeholder="000000"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          disabled={isSubmitting}
        />
        <Button
          className={isSubmitting ? "cursor-not-allowed opacity-50" : ""}
          text={isSubmitting ? "Verifying..." : "Verify"}
          disabled={isSubmitting}
        />
      </form>

      {msg && <p className="mt-3 text-sm text-red-500">{msg}</p>}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={isResending || resendTimer > 0}
            className={`font-medium text-blue-600 hover:text-blue-800 ${
              isResending || resendTimer > 0
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            {isResending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}
