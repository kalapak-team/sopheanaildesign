"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Shield,
  Mail,
  UserRound,
  Settings,
  ExternalLink,
  Images,
  Tag,
  Percent,
  Clock,
} from "lucide-react";
import { adminFetch } from "./api";
import { ImageUpload } from "./ImageUpload";
import { Card, Field, Btn, inputClass, Spinner } from "./ui";
import type { NotifyFn, StatsData, TabId } from "./types";
import type { AdminUser } from "./ProfileMenu";
import { mediaUrl } from "./media";

export function ProfileTab({
  token,
  user,
  stats,
  notify,
  onUserUpdate,
  handleUnauthorized,
  onNavigate,
}: {
  token: string;
  user: AdminUser | null;
  stats?: StatsData | null;
  notify: NotifyFn;
  onUserUpdate: (user: AdminUser) => void;
  handleUnauthorized: () => void;
  onNavigate?: (tab: TabId) => void;
}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  async function save() {
    setBusy(true);
    try {
      const body: Record<string, string> = {
        name,
        email,
        avatar,
      };
      if (password) {
        body.password = password;
        body.password_confirmation = passwordConfirmation;
      }
      const res = await adminFetch("/profile", token, {
        method: "PUT",
        json: body,
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        notify(
          "error",
          err?.message ||
            err?.errors?.password?.[0] ||
            err?.errors?.email?.[0] ||
            "Profil konnte nicht gespeichert werden"
        );
        return;
      }
      const data = await res.json();
      onUserUpdate(data.user);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      setPassword("");
      setPasswordConfirmation("");
      notify("success", "Profil gespeichert");
    } finally {
      setBusy(false);
    }
  }

  const avatarSrc = mediaUrl(avatar);
  const initials = (name || "A")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const quickStats = [
    {
      label: "Nachrichten",
      value: stats?.totals.unread_messages ?? "—",
      hint: "ungelesen",
      icon: Mail,
      tab: "messages" as TabId,
    },
    {
      label: "Services",
      value: stats?.totals.services ?? "—",
      hint: "Preise",
      icon: Tag,
      tab: "services" as TabId,
    },
    {
      label: "Aktionen",
      value: stats?.totals.promotions ?? "—",
      hint: "aktiv",
      icon: Percent,
      tab: "promotions" as TabId,
    },
    {
      label: "Medien",
      value:
        stats != null
          ? stats.totals.hero_slides + stats.totals.gallery
          : "—",
      hint: "Slides + Galerie",
      icon: Images,
      tab: "gallery" as TabId,
    },
  ];

  const shortcuts = [
    {
      label: "Website-Inhalte",
      desc: "Texte, Kontakt, Bilder",
      icon: Settings,
      tab: "settings" as TabId,
    },
    {
      label: "Hero Slides",
      desc: "Startseiten-Carousel",
      icon: Images,
      tab: "hero" as TabId,
    },
    {
      label: "Öffnungszeiten",
      desc: "Footer-Zeiten",
      icon: Clock,
      tab: "hours" as TabId,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Wide identity banner */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-[#151515] via-[#1c1c1c] to-brand-pink/50 px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="shrink-0">
              <ImageUpload
                token={token}
                value={avatar}
                onChange={setAvatar}
                folder="avatars"
                variant="avatar"
                onUnauthorized={handleUnauthorized}
                onError={(m) => notify("error", m)}
              />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Mein Konto
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold text-white">
                {name || "Admin"}
              </h2>
              <p className="mt-1 truncate text-sm text-white/60">{email}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  <Shield className="h-3.5 w-3.5 text-brand-pink" />
                  {(user?.role || "admin").toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  <UserRound className="h-3.5 w-3.5" />
                  ID {user?.id ?? "—"}
                </span>
              </div>
            </div>
            <div className="hidden shrink-0 lg:block">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-xl font-bold text-white/80 ring-1 ring-white/15">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="" className="h-full w-full object-cover opacity-40" />
                ) : (
                  initials
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onNavigate?.(s.tab)}
              className="rounded-xl border border-neutral-200/80 bg-white p-4 text-left shadow-sm shadow-neutral-200/40 transition hover:border-brand-pink/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {s.label}
                </p>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-pink/10 text-brand-pink">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">
                {s.value}
              </p>
              <p className="text-xs text-neutral-400">{s.hint}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Edit form */}
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Profildaten
              </h3>
              <p className="mt-0.5 text-xs text-neutral-400">
                Name, E-Mail und Passwort aktualisieren.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="E-Mail">
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
          </div>

          <div className="mt-5 rounded-xl border border-neutral-100 bg-neutral-50/90 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Passwort ändern
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Neues Passwort">
                <input
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional"
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Bestätigen">
                <input
                  type="password"
                  className={inputClass}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Optional"
                  autoComplete="new-password"
                />
              </Field>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              Leer lassen = Passwort bleibt unverändert.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Btn onClick={save} disabled={busy}>
              {busy ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              Speichern
            </Btn>
            <Btn
              variant="secondary"
              onClick={() => {
                setName(user?.name || "");
                setEmail(user?.email || "");
                setAvatar(user?.avatar || "");
                setPassword("");
                setPasswordConfirmation("");
              }}
              disabled={busy}
            >
              Zurücksetzen
            </Btn>
          </div>
        </Card>

        {/* Side column */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Konto-Info
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                <dt className="text-neutral-400">Rolle</dt>
                <dd className="font-semibold text-neutral-800">
                  {user?.role || "admin"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                <dt className="text-neutral-400">E-Mail</dt>
                <dd className="max-w-[60%] truncate text-right font-medium text-neutral-800">
                  {email || "—"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                <dt className="text-neutral-400">Profilbild</dt>
                <dd className="font-medium text-neutral-800">
                  {avatar ? "Hochgeladen" : "Standard"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-neutral-400">Speicher</dt>
                <dd className="font-medium text-neutral-800">Cloudflare R2</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Schnellzugriff
            </h3>
            <div className="mt-3 space-y-2">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onNavigate?.(item.tab)}
                    className="flex w-full items-center gap-3 rounded-xl border border-neutral-100 px-3 py-2.5 text-left transition hover:border-brand-pink/25 hover:bg-brand-pink/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-neutral-900">
                        {item.label}
                      </span>
                      <span className="block text-xs text-neutral-400">
                        {item.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-100 px-3 py-2.5 text-left transition hover:border-brand-pink/25 hover:bg-brand-pink/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <ExternalLink className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-neutral-900">
                    Website ansehen
                  </span>
                  <span className="block text-xs text-neutral-400">
                    Öffentliche Startseite
                  </span>
                </span>
              </a>
            </div>
          </Card>

          <Card className="border-brand-pink/15 bg-gradient-to-br from-brand-pink/5 to-white p-5">
            <h3 className="text-sm font-semibold text-neutral-900">Tipp</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Lade ein klares Profilbild hoch — es erscheint im Header-Menü.
              Inhalte und Bilder der Website findest du unter{" "}
              <button
                type="button"
                className="font-semibold text-brand-pink hover:underline"
                onClick={() => onNavigate?.("settings")}
              >
                Setting
              </button>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
