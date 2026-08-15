"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail as MailIcon } from "lucide-react";
import { API_URL } from "@/lib/api";

function friendlyError(status: number, data: unknown): string {
  if (data && typeof data === "object") {
    const body = data as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    const fieldError = body.errors?.email?.[0] || body.errors?.password?.[0];
    if (fieldError) return fieldError;
    if (body.message && body.message !== "Server Error") return body.message;
  }

  if (status === 401 || status === 422) {
    return "E-Mail oder Passwort ist ungültig.";
  }
  if (status === 403) {
    return "Kein Zugriff auf das Admin-Dashboard.";
  }
  if (status >= 500) {
    return "Der Server ist vorübergehend nicht erreichbar. Bitte später erneut versuchen.";
  }
  return "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      let data: unknown = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        await res.text();
      }

      if (!res.ok) {
        setError(friendlyError(res.status, data));
        return;
      }

      const payload = data as {
        token?: string;
        user?: unknown;
      };

      if (!payload?.token) {
        setError("Ungültige Antwort vom Server.");
        return;
      }

      localStorage.setItem("admin_token", payload.token);
      localStorage.setItem("admin_user", JSON.stringify(payload.user ?? null));
      router.push("/admin");
    } catch {
      setError(
        "Verbindung zum Server fehlgeschlagen. Bitte Internet prüfen und erneut versuchen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="font-poppins relative flex min-h-screen flex-col items-center justify-center px-4 py-12"
    >
      {/* Soft brand atmosphere — no neon glow / grid */}
      <div className="absolute inset-0 bg-[#faf7f8]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(252,3,161,0.08), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(252,3,161,0.05), transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/images/brand/logo-full.png"
            alt="Sophea Naildesign"
            width={280}
            height={90}
            priority
            className="h-auto w-[220px] object-contain sm:w-[260px]"
          />
          <p className="mt-4 text-[13px] font-medium tracking-[0.08em] text-[#6b6b6b] uppercase">
            Admin-Bereich
          </p>
        </div>

        <div className="rounded-2xl border border-[#ebe6e9] bg-white p-8 shadow-[0_20px_50px_-28px_rgba(40,20,35,0.35)] sm:p-9">
          <div className="mb-7">
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a1a]">
              Willkommen zurück
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[#737373]">
              Melde dich an, um Inhalte, Preise und Termine zu verwalten.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-[13px] font-medium text-[#3f3f3f]"
              >
                E-Mail
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="name@beispiel.ch"
                  className="w-full rounded-xl border border-[#e5e0e3] bg-[#fcfbfc] py-3 pl-11 pr-3 text-sm text-[#1a1a1a] placeholder:text-[#b0b0b0] outline-none transition focus:border-brand-pink focus:bg-white focus:ring-2 focus:ring-brand-pink/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-[13px] font-medium text-[#3f3f3f]"
              >
                Passwort
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e5e0e3] bg-[#fcfbfc] py-3 pl-11 pr-11 text-sm text-[#1a1a1a] placeholder:text-[#b0b0b0] outline-none transition focus:border-brand-pink focus:bg-white focus:ring-2 focus:ring-brand-pink/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#a3a3a3] transition hover:text-[#525252]"
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-snug text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-pink py-3.5 text-sm font-semibold text-white transition hover:bg-brand-pink-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Wird angemeldet…" : "Anmelden"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-[#8a8a8a]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium text-[#5c5c5c] transition hover:text-brand-pink"
          >
            <span aria-hidden>←</span>
            Zurück zur Website
          </Link>
        </p>
      </div>
    </div>
  );
}
