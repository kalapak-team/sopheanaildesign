"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Images,
  Tag,
  Percent,
  Clock,
  Mail,
  FileText,
  ExternalLink,
  LogOut,
  Menu,
  X,
  GalleryHorizontal,
  User,
} from "lucide-react";
import { adminFetch } from "@/components/admin/api";
import { Toast, Spinner } from "@/components/admin/ui";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { HeroSlidesTab } from "@/components/admin/HeroSlidesTab";
import { PreiseTab } from "@/components/admin/PreiseTab";
import { PromotionsTab } from "@/components/admin/PromotionsTab";
import { GalleryTab } from "@/components/admin/GalleryTab";
import { HoursTab } from "@/components/admin/HoursTab";
import { ContentTab } from "@/components/admin/ContentTab";
import { MessagesTab } from "@/components/admin/MessagesTab";
import { ProfileTab } from "@/components/admin/ProfileTab";
import { ProfileMenu, type AdminUser } from "@/components/admin/ProfileMenu";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { useAdminTheme } from "@/components/admin/theme";
import type {
  TabId,
  ToastState,
  StatsData,
  ServiceCategory,
  Promotion,
  HeroSlide,
  GalleryImage,
  OpeningHour,
  ContactMessage,
  SiteSettings,
} from "@/components/admin/types";
import { poppins } from "@/components/admin/types";
import {
  clearCachedStats,
  readCachedStats,
  writeCachedStats,
} from "@/components/admin/statsCache";

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hero", label: "Hero Slides", icon: GalleryHorizontal },
  { id: "services", label: "Preise", icon: Tag },
  { id: "promotions", label: "Aktionen", icon: Percent },
  { id: "gallery", label: "Galerie", icon: Images },
  { id: "hours", label: "Öffnungszeiten", icon: Clock },
  { id: "content", label: "Inhalte", icon: FileText },
  { id: "messages", label: "Nachrichten", icon: Mail },
];

const EXTRA_TITLES: Partial<Record<TabId, string>> = {
  profile: "My Profile",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  // Keep SSR + first client paint identical — hydrate from localStorage only after mount
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Partial<Record<TabId, boolean>>>(
    {}
  );
  const loadedTabsRef = useRef<Partial<Record<TabId, boolean>>>({});

  const [stats, setStats] = useState<StatsData | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const { theme, toggleTheme } = useAdminTheme();

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.replace("/admin/login");
      setHydrated(true);
      return;
    }
    setToken(t);
    try {
      const raw = localStorage.getItem("admin_user");
      if (raw) setUser(JSON.parse(raw) as AdminUser);
    } catch {
      /* ignore */
    }
    const cached = readCachedStats();
    if (cached) {
      setStats(cached);
      setLoading(false);
      loadedTabsRef.current.overview = true;
      setLoadedTabs((prev) => ({ ...prev, overview: true }));
    }
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function notify(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    clearCachedStats();
    router.replace("/admin/login");
  }, [router]);

  const normalizeStats = useCallback((statsData: unknown): StatsData | null => {
    if (!statsData || typeof statsData !== "object") return null;
    const data = statsData as StatsData;
    if (!data.totals || typeof data.totals !== "object") return null;
    return {
      ...data,
      recent_messages: Array.isArray(data.recent_messages)
        ? data.recent_messages
        : [],
      messages_last_7_days: Array.isArray(data.messages_last_7_days)
        ? data.messages_last_7_days
        : [],
      message_status: Array.isArray(data.message_status)
        ? data.message_status
        : [],
      content_mix: Array.isArray(data.content_mix) ? data.content_mix : [],
    };
  }, []);

  const applyPartial = useCallback(
    (data: Record<string, unknown>) => {
      const bootStats = normalizeStats(data.stats);
      if (bootStats) setStats(bootStats);
      if (Array.isArray(data.messages)) {
        setMessages(data.messages as ContactMessage[]);
      }
      if (Array.isArray(data.categories)) {
        setCategories(data.categories as ServiceCategory[]);
      }
      if (Array.isArray(data.promotions)) {
        setPromotions(data.promotions as Promotion[]);
      }
      if (Array.isArray(data.opening_hours)) {
        setHours(data.opening_hours as OpeningHour[]);
      }
      if (data.settings && typeof data.settings === "object") {
        setSettings(data.settings as SiteSettings);
      }
      if (Array.isArray(data.hero_slides)) {
        setHeroSlides(data.hero_slides as HeroSlide[]);
      }
      if (Array.isArray(data.gallery)) {
        setGallery(data.gallery as GalleryImage[]);
      }
      if (data.user && typeof data.user === "object") {
        setUser(data.user as AdminUser);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      }
    },
    [normalizeStats]
  );

  const tabOnlyKey = useCallback((id: TabId): string | null => {
    switch (id) {
      case "overview":
        return "stats";
      case "hero":
        return "hero_slides";
      case "services":
        return "categories";
      case "promotions":
        return "promotions";
      case "gallery":
        return "gallery";
      case "hours":
        return "opening_hours";
      case "content":
        return "settings";
      case "messages":
        return "messages";
      case "profile":
        return null;
      default:
        return null;
    }
  }, []);

  /** Stale-while-revalidate: show cached Overview instantly, refresh in background */
  const loadOverview = useCallback(
    async (opts?: { force?: boolean }) => {
      if (!token) return;

      const cached = readCachedStats();
      if (cached && !opts?.force) {
        setStats(cached);
        setLoading(false);
      } else if (!cached) {
        setLoading(true);
      }

      try {
        const res = await adminFetch("/stats", token);
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          if (!cached) notify("error", "Overview konnte nicht geladen werden");
          return;
        }
        const normalized = normalizeStats(await res.json());
        if (normalized) {
          setStats(normalized);
          writeCachedStats(normalized);
        }
        loadedTabsRef.current.overview = true;
        setLoadedTabs((prev) => ({ ...prev, overview: true }));
      } catch {
        if (!readCachedStats()) {
          notify("error", "Overview konnte nicht geladen werden");
        }
      } finally {
        setLoading(false);
      }
    },
    [token, handleUnauthorized, normalizeStats]
  );

  /** Lazy-load one tab's data when opened */
  const loadTab = useCallback(
    async (id: TabId, opts?: { force?: boolean }) => {
      if (!token) return;
      if (id === "profile") return;
      if (id === "overview") {
        await loadOverview({ force: Boolean(opts?.force) });
        return;
      }
      if (!opts?.force && loadedTabsRef.current[id]) return;

      const only = tabOnlyKey(id);
      if (!only) return;

      setTabLoading(true);
      try {
        const res = await adminFetch(
          `/bootstrap?only=${encodeURIComponent(only)}${opts?.force ? "&fresh=1" : ""}`,
          token
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          notify("error", "Daten konnten nicht geladen werden");
          return;
        }
        applyPartial(await res.json());
        loadedTabsRef.current[id] = true;
        setLoadedTabs((prev) => ({ ...prev, [id]: true }));
      } catch {
        notify("error", "Daten konnten nicht geladen werden");
      } finally {
        setTabLoading(false);
      }
    },
    [token, tabOnlyKey, loadOverview, handleUnauthorized, applyPartial]
  );

  const reloadCurrent = useCallback(async () => {
    await loadTab(tab, { force: true });
  }, [tab, loadTab]);

  useEffect(() => {
    if (!hydrated || !token) return;
    void loadOverview();
  }, [hydrated, token, loadOverview]);

  useEffect(() => {
    if (!hydrated || !token || tab === "overview") return;
    void loadTab(tab);
  }, [hydrated, token, tab, loadTab]);

  async function logout() {
    if (token) {
      await adminFetch("/logout", token, { method: "POST" }).catch(() => null);
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    clearCachedStats();
    router.replace("/admin/login");
  }

  if (!hydrated || !token) {
    return (
      <div
        className={`admin-app flex min-h-screen items-center justify-center ${
          theme === "dark" ? "dark" : ""
        }`}
        style={poppins}
      >
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const currentTabMeta = TABS.find((t) => t.id === tab);
  const headerTitle =
    currentTabMeta?.label || EXTRA_TITLES[tab] || "Admin";
  const unreadCount =
    stats?.totals?.unread_messages ??
    messages.filter((m) => !m.is_read).length;

  const tabProps = {
    token,
    notify,
    onReload: reloadCurrent,
    handleUnauthorized,
  };

  return (
    <div
      className={`admin-app min-h-screen ${theme === "dark" ? "dark" : ""}`}
      style={poppins}
      data-theme={theme}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#151515] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-6">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-pink/20 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-lg font-bold leading-tight text-white">
                Sophea <span className="text-brand-pink">Admin</span>
              </p>
              <p className="mt-1 text-[11px] font-medium tracking-wide text-white/40 uppercase">
                Naildesign CMS
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const badge =
              t.id === "messages" && unreadCount > 0 ? unreadCount : null;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setSidebarOpen(false);
                }}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/30"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active ? "text-white" : "text-white/40 group-hover:text-brand-pink"
                  }`}
                  strokeWidth={2}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {badge !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      active
                        ? "bg-white/25 text-white"
                        : "bg-brand-pink text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              setTab("profile");
              setSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              tab === "profile"
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User className="h-[18px] w-[18px] text-white/40" strokeWidth={2} />
            My Profile
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-[18px] w-[18px] text-white/40" strokeWidth={2} />
            Website ansehen
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="admin-header sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200/80 bg-white/85 px-4 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">{headerTitle}</h1>
              <p className="text-[11px] text-neutral-400">
                Sophea Naildesign · Content Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {loading || tabLoading ? <Spinner className="h-4 w-4" /> : null}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <ProfileMenu
              user={user}
              onProfile={() => setTab("profile")}
              onInhalte={() => setTab("content")}
              onLogout={logout}
            />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-8">
          {tab === "overview" && (
            <OverviewTab stats={stats} onGoMessages={() => setTab("messages")} />
          )}
          {tab === "hero" && (
            <HeroSlidesTab slides={heroSlides} {...tabProps} />
          )}
          {tab === "services" && (
            <PreiseTab categories={categories} {...tabProps} />
          )}
          {tab === "promotions" && (
            <PromotionsTab promotions={promotions} {...tabProps} />
          )}
          {tab === "gallery" && <GalleryTab gallery={gallery} {...tabProps} />}
          {tab === "hours" && <HoursTab hours={hours} {...tabProps} />}
          {tab === "content" && (
            <ContentTab settings={settings} {...tabProps} />
          )}
          {tab === "profile" && (
            <ProfileTab
              token={token}
              user={user}
              stats={stats}
              notify={notify}
              onUserUpdate={setUser}
              handleUnauthorized={handleUnauthorized}
              onNavigate={setTab}
            />
          )}
          {tab === "messages" && (
            <MessagesTab messages={messages} {...tabProps} />
          )}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
