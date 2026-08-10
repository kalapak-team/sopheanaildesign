"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail as MailIcon, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || data?.errors?.email?.[0] || "Login fehlgeschlagen");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      router.push("/admin");
    } catch {
      setError("Server nicht erreichbar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold text-neutral-900">
            Sophea <span className="text-brand-pink">Naildesign</span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">Admin Dashboard</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50"
        >
          <h1 className="text-lg font-semibold text-neutral-900">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-500">Enter your admin credentials to continue.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600">Email</label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@sopheanaildesign.ch"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="admin123"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-pink py-2.5 text-sm font-semibold text-white transition hover:bg-brand-pink-hot disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Anmelden"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Sophea Naildesign · Internal use only
        </p>
      </div>
    </div>
  );
}
