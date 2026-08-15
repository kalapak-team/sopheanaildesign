"use client";

import {
  LayoutDashboard,
  Percent,
  Mail,
  Images,
  Layers,
} from "lucide-react";
import { Card, SectionHeader, Spinner } from "./ui";
import { BarChart, DonutChart, ContentMixBars } from "./charts";
import type { StatsData } from "./types";

export function OverviewTab({
  stats,
}: {
  stats: StatsData | null;
}) {
  if (!stats?.totals) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-neutral-400">
        <Spinner className="h-5 w-5 text-brand-pink" />
        <p>Lade Overview…</p>
      </Card>
    );
  }

  const recentMessages = Array.isArray(stats.recent_messages)
    ? stats.recent_messages
    : [];
  const messagesLast7 = Array.isArray(stats.messages_last_7_days)
    ? stats.messages_last_7_days
    : [];
  const messageStatus = Array.isArray(stats.message_status)
    ? stats.message_status
    : [];
  const contentMix = Array.isArray(stats.content_mix) ? stats.content_mix : [];

  const kpis = [
    {
      label: "Nachrichten",
      value: stats.totals.messages ?? 0,
      sub: `${stats.totals.unread_messages ?? 0} ungelesen`,
      icon: Mail,
      tone: "text-brand-pink bg-brand-pink/10",
    },
    {
      label: "Aktionen",
      value: stats.totals.promotions ?? 0,
      sub: "Promotions",
      icon: Percent,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Hero Slides",
      value: stats.totals.hero_slides ?? 0,
      sub: "Startseiten-Carousel",
      icon: Images,
      tone: "text-sky-600 bg-sky-50",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Overview"
        description="Kennzahlen, Trends und aktuelle Nachrichten auf einen Blick."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {k.label}
                </p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${k.tone}`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
                {k.value}
              </p>
              <p className="mt-1 text-xs text-neutral-400">{k.sub}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-brand-pink" />
            <h3 className="text-sm font-semibold text-neutral-900">
              Nachrichten – letzte 7 Tage
            </h3>
          </div>
          <BarChart data={messagesLast7} />
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-pink" />
            <h3 className="text-sm font-semibold text-neutral-900">
              Gelesen / Ungelesen
            </h3>
          </div>
          <DonutChart segments={messageStatus} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-pink" />
            <h3 className="text-sm font-semibold text-neutral-900">Content Mix</h3>
          </div>
          <ContentMixBars data={contentMix} />
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
            <h3 className="text-sm font-semibold text-neutral-900">
              Letzte Nachrichten
            </h3>
          </div>
          {recentMessages.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-neutral-400">
              Noch keine Nachrichten
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {recentMessages.map((m) => (
                <li key={m.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!m.is_read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                        )}
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {m.name}
                        </p>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-neutral-400">
                        {m.email}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-600">
                        {m.message}
                      </p>
                    </div>
                    <time className="shrink-0 text-[11px] text-neutral-400">
                      {new Date(m.created_at).toLocaleDateString("de-CH", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
