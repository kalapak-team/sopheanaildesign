"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Tag,
  Percent,
  Clock,
  Mail,
  Settings as SettingsIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/lib/api";

type Tab = "overview" | "services" | "promotions" | "hours" | "messages" | "settings";

type ToastState = { type: "success" | "error"; message: string } | null;

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "services", label: "Preise", icon: Tag },
  { id: "promotions", label: "Aktionen", icon: Percent },
  { id: "hours", label: "Öffnungszeiten", icon: Clock },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [settingsText, setSettingsText] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    [token]
  );

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.replace("/admin/login");
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    void loadAll();
  }, [token]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [siteRes, msgRes, catRes, promoRes, hourRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/site`),
        fetch(`${API_URL}/admin/messages`, { headers }),
        fetch(`${API_URL}/admin/categories`, { headers }),
        fetch(`${API_URL}/admin/promotions`, { headers }),
        fetch(`${API_URL}/admin/opening-hours`, { headers }),
        fetch(`${API_URL}/admin/settings`, { headers }),
      ]);

      if (msgRes.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      setSite(await siteRes.json());
      setMessages(await msgRes.json());
      setCategories(await catRes.json());
      setPromotions(await promoRes.json());
      setHours(await hourRes.json());
      setSettingsText(JSON.stringify(await settingsRes.json(), null, 2));
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch(`${API_URL}/admin/logout`, { method: "POST", headers });
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  async function saveSettings() {
    setSavingSettings(true);
    try {
      const parsed = JSON.parse(settingsText);
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ settings: parsed }),
      });
      notify(res.ok ? "success" : "error", res.ok ? "Settings gespeichert" : "Fehler beim Speichern");
      await loadAll();
    } catch {
      notify("error", "JSON ungültig");
    } finally {
      setSavingSettings(false);
    }
  }

  async function updatePromotionPrice(id: number, price: string) {
    await fetch(`${API_URL}/admin/promotions/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ price: Number(price) }),
    });
    notify("success", "Promotion aktualisiert");
    await loadAll();
  }

  async function updateServicePrice(id: number, price: string) {
    await fetch(`${API_URL}/admin/services/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ price: Number(price) }),
    });
    notify("success", "Service aktualisiert");
    await loadAll();
  }

  async function updateHour(id: number, hoursValue: string) {
    await fetch(`${API_URL}/admin/opening-hours/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ hours: hoursValue }),
    });
    notify("success", "Öffnungszeiten aktualisiert");
    await loadAll();
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-pink" />
      </div>
    );
  }

  const totalServices = categories.reduce((n, c) => n + (c.services?.length || 0), 0);
  const currentTabMeta = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-lg font-bold leading-tight text-neutral-900">
              Sophea <span className="text-brand-pink">Admin</span>
            </p>
            <p className="text-xs text-neutral-400">Naildesign Dashboard</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const badge = t.id === "messages" && messages.length > 0 ? messages.length : null;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-pink text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                <span className="flex-1 text-left">{t.label}</span>
                {badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      active ? "bg-white/25 text-white" : "bg-brand-pink/10 text-brand-pink"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <ExternalLink className="h-[18px] w-[18px]" strokeWidth={2} />
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">{currentTabMeta.label}</h1>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
        </header>

        <main className="px-4 py-6 sm:px-8">
          {tab === "overview" && (
            <OverviewTab
              categories={categories}
              totalServices={totalServices}
              promotions={promotions}
              messages={messages}
              phone={site?.settings?.phone}
            />
          )}

          {tab === "services" && (
            <ServicesTab categories={categories} onUpdatePrice={updateServicePrice} />
          )}

          {tab === "promotions" && (
            <PromotionsTab promotions={promotions} onUpdatePrice={updatePromotionPrice} />
          )}

          {tab === "hours" && <HoursTab hours={hours} onUpdate={updateHour} />}

          {tab === "messages" && <MessagesTab messages={messages} />}

          {tab === "settings" && (
            <SettingsTab
              value={settingsText}
              onChange={setSettingsText}
              onSave={saveSettings}
              saving={savingSettings}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success" ? "bg-neutral-900 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-neutral-500">{description}</p>}
    </div>
  );
}

function OverviewTab({
  categories,
  totalServices,
  promotions,
  messages,
  phone,
}: {
  categories: any[];
  totalServices: number;
  promotions: any[];
  messages: any[];
  phone?: string;
}) {
  const stats = [
    { label: "Categories", value: categories.length, icon: Tag, color: "text-blue-600 bg-blue-50" },
    { label: "Services", value: totalServices, icon: LayoutDashboard, color: "text-violet-600 bg-violet-50" },
    { label: "Promotions", value: promotions.length, icon: Percent, color: "text-brand-pink bg-brand-pink/10" },
    { label: "Messages", value: messages.length, icon: Mail, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div>
      <SectionHeader title="Welcome back" description="Here's what's happening with your site today." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {s.label}
                </p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-neutral-900">{s.value}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm text-neutral-600">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Public API online: <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/site</code>
        </span>
        <span className="text-neutral-300">•</span>
        <span>Phone: {phone || "—"}</span>
      </Card>
    </div>
  );
}

function ServicesTab({
  categories,
  onUpdatePrice,
}: {
  categories: any[];
  onUpdatePrice: (id: number, price: string) => void;
}) {
  return (
    <div>
      <SectionHeader title="Preise" description="Update service prices per category. Changes save on blur." />
      <div className="space-y-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <div className="border-b border-neutral-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-neutral-900">{cat.name}</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {cat.services?.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm hover:bg-neutral-50"
                >
                  <span className="text-neutral-700">{s.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-neutral-400">CHF</span>
                    <input
                      defaultValue={s.price}
                      className="w-20 rounded-md border border-neutral-200 px-2 py-1.5 text-right text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                      onBlur={(e) => onUpdatePrice(s.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PromotionsTab({
  promotions,
  onUpdatePrice,
}: {
  promotions: any[];
  onUpdatePrice: (id: number, price: string) => void;
}) {
  return (
    <div>
      <SectionHeader title="Aktionen" description="Manage limited-time promotion pricing." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((p) => (
          <Card key={p.id} className="p-4">
            <p className="font-semibold text-neutral-900">
              {p.title} <span className="text-brand-pink">{p.highlight}</span>
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">{p.header_style}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs text-neutral-400">CHF</span>
              <input
                defaultValue={p.price}
                className="w-24 rounded-md border border-neutral-200 px-2 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                onBlur={(e) => onUpdatePrice(p.id, e.target.value)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HoursTab({
  hours,
  onUpdate,
}: {
  hours: any[];
  onUpdate: (id: number, value: string) => void;
}) {
  return (
    <div>
      <SectionHeader title="Öffnungszeiten" description="Edit opening hours shown in the footer." />
      <Card>
        <div className="divide-y divide-neutral-100">
          {hours.map((h) => (
            <div key={h.id} className="flex items-center gap-4 px-5 py-3">
              <span className="w-32 shrink-0 text-sm font-medium text-neutral-700">{h.day_label}</span>
              <input
                defaultValue={h.hours}
                className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                onBlur={(e) => onUpdate(h.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MessagesTab({ messages }: { messages: any[] }) {
  return (
    <div>
      <SectionHeader title="Messages" description="Contact form submissions from your visitors." />
      {messages.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Mail className="h-8 w-8 text-neutral-300" />
          <p className="text-sm text-neutral-500">Keine Nachrichten</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">{m.name}</p>
                <span className="text-xs text-neutral-400">{m.email}</span>
              </div>
              <p className="mt-1.5 text-sm text-neutral-600">{m.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({
  value,
  onChange,
  onSave,
  saving,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <SectionHeader
        title="Settings"
        description="Advanced: edit raw site settings as JSON. Be careful with formatting."
      />
      <Card className="overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          spellCheck={false}
          className="w-full resize-none bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-neutral-100 focus:outline-none"
        />
        <div className="flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-4 py-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink-hot disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save settings
          </button>
        </div>
      </Card>
    </div>
  );
}
