"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Mail as MailIcon, AlertCircle, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/api";

const poppins = { fontFamily: "var(--font-poppins), Poppins, sans-serif" } as const;

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
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={poppins}
    >
      <div className="absolute inset-0 bg-[#0f0f0f]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-pink/25 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-brand-pink/15 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink/15 ring-1 ring-brand-pink/40">
            <Sparkles className="h-5 w-5 text-brand-pink" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white">
            Sophea <span className="text-brand-pink">Naildesign</span>
          </p>
          <p className="mt-1.5 text-sm text-white/45">Admin Dashboard · Intern</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-[#1a1a1a]/90 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <h1 className="text-lg font-semibold text-white">Anmelden</h1>
          <p className="mt-1 text-sm text-white/40">
            Melde dich an, um Inhalte und Preise zu verwalten.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Email
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@sopheanaildesign.ch"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Passwort
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="admin123"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink py-3 text-sm font-semibold text-white shadow-lg shadow-brand-pink/30 transition hover:bg-brand-pink-hot disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Wird angemeldet…" : "Anmelden"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          <Link href="/" className="hover:text-brand-pink">
            ← Zurück zur Website
          </Link>
        </p>
      </div>
    </div>
  );
}
