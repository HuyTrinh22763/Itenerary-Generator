"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/apiClients";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authAPI.login(data.email, data.password),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Redirect to home
      router.push("/");
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || "Login failed");
    },
  });

  // When user submits the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    // Trigger the mutation
    mutation.mutate({
      email,
      password,
    });
  };

  // Build the form JSX
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-zinc-50">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
