"use client";

import { useState } from "react";
import { Mail, Trash2, CheckCheck, ExternalLink } from "lucide-react";
import { adminFetch } from "./api";
import { Card, SectionHeader, Btn, EmptyState, Spinner } from "./ui";
import type { ContactMessage, NotifyFn } from "./types";

export function MessagesTab({
  token,
  messages,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  messages: ContactMessage[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [busy, setBusy] = useState<number | null>(null);

  async function request(path: string, options: Parameters<typeof adminFetch>[2]) {
    const res = await adminFetch(path, token, options);
    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    return res;
  }

  async function markRead(id: number) {
    setBusy(id);
    try {
      const res = await request(`/messages/${id}/read`, { method: "PUT" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Markieren fehlgeschlagen");
        return;
      }
      notify("success", "Als gelesen markiert");
      await onReload();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Nachricht löschen?")) return;
    setBusy(id);
    try {
      const res = await request(`/messages/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Nachricht gelöscht");
      await onReload();
    } finally {
      setBusy(null);
    }
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <SectionHeader
        title="Nachrichten"
        description={
          unread > 0
            ? `${unread} ungelesen · ${messages.length} gesamt`
            : `${messages.length} Nachrichten`
        }
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Keine Nachrichten"
          description="Kontaktformular-Einreichungen erscheinen hier."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card
              key={m.id}
              className={`overflow-hidden ${
                !m.is_read ? "ring-1 ring-brand-pink/30" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-brand-pink" />
                    )}
                    <p className="text-sm font-semibold text-neutral-900">{m.name}</p>
                    {!m.is_read && (
                      <span className="rounded bg-brand-pink/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-pink">
                        Neu
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-400">
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1 font-medium text-brand-pink hover:underline"
                    >
                      {m.email}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <time>
                      {new Date(m.created_at).toLocaleString("de-CH", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!m.is_read && (
                    <Btn
                      variant="secondary"
                      onClick={() => markRead(m.id)}
                      disabled={busy === m.id}
                    >
                      {busy === m.id ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <CheckCheck className="h-4 w-4" />
                      )}
                      Gelesen
                    </Btn>
                  )}
                  <Btn
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => remove(m.id)}
                    disabled={busy === m.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Btn>
                </div>
              </div>
              <p className="whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed text-neutral-700">
                {m.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
