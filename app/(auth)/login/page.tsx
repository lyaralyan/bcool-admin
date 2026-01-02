"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/app/api/mutations";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login?.token) {
        document.cookie = `token=${data.login.token}; path=/; max-age=3600`;
        localStorage.setItem("role", data.login.role);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed: No token received");
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Invalid credentials");
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login({ variables: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
}
