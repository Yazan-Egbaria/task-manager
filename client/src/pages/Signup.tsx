import { useState } from "react";
import { api } from "../lib/api";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password });
      toast.success(
        "Signup successful, Check your email for verification code.",
      );
      navigate("/verify", { state: { email } });
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="w-md">
      <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Sign Up" />
      </form>
      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      <p className="mt-3 text-sm">
        Got an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
