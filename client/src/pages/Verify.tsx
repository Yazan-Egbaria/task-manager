import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";

export default function Verify() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState<string>(loc?.state?.email || "");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/auth/verify", { email, code });
      setMsg("Email verified. You can now log in.");
      navigate("/login", { state: { email } });
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-semibold">Verify your email</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button text="Verify" />
      </form>
      {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
    </div>
  );
}
