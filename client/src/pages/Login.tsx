import { useNavigate, useLocation, Link } from "react-router";
import { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState<string>(loc?.state?.email || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { fetchUser } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", { email, password });
      await fetchUser();
      navigate("/tasks");
      toast.success("Logged in successfully");
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-md">
      <h1 className="mb-4 text-2xl font-semibold">Welcome back</h1>
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
        <Button text="Login" />
      </form>
      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      <p className="mt-3 text-sm">
        Don't have an account?{" "}
        <Link className="underline" to="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
