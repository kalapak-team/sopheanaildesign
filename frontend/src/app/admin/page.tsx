"use client";

import { useCallback, useEffect, useState } from "react";
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
  Settings,
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
  settings: "Setting",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

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
      return;
    }
    setToken(t);
    try {
      const raw = localStorage.getItem("admin_user");
      if (raw) setUser(JSON.parse(raw) as AdminUser);
    } catch {
      /* ignore */
    }
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
    router.replace("/admin/login");
  }, [router]);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Load overview-critical data first so the dashboard isn't stuck waiting
      // on every tab's endpoints at once.
      const [statsRes, meRes] = await Promise.all([
        adminFetch("/stats", token),
        adminFetch("/me", token),
      ]);

      if ([statsRes, meRes].some((r) => r.status === 401)) {
        handleUnauthorized();
        return;
      }

      if (statsRes.ok) setStats(await statsRes.json());
      if (meRes.ok) {
        const me = await meRes.json();
        if (me.user) {
          setUser(me.user);
          localStorage.setItem("admin_user", JSON.stringify(me.user));
        }
      }

      setLoading(false);

      const [
        msgRes,
        catRes,
        promoRes,
        hourRes,
        settingsRes,
        heroRes,
        galleryRes,
      ] = await Promise.all([
        adminFetch("/messages", token),
        adminFetch("/categories", token),
        adminFetch("/promotions", token),
        adminFetch("/opening-hours", token),
        adminFetch("/settings", token),
        adminFetch("/hero-slides", token),
        adminFetch("/gallery", token),
      ]);

      if (
        [
          msgRes,
          catRes,
          promoRes,
          hourRes,
          settingsRes,
          heroRes,
          galleryRes,
        ].some((r) => r.status === 401)
      ) {
        handleUnauthorized();
        return;
      }

      if (msgRes.ok) setMessages(await msgRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (promoRes.ok) setPromotions(await promoRes.json());
      if (hourRes.ok) setHours(await hourRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (heroRes.ok) setHeroSlides(await heroRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
    } catch {
      notify("error", "Daten konnten nicht geladen werden");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  useEffect(() => {
    if (!token) return;
    void loadAll();
  }, [token, loadAll]);

  async function logout() {
    if (token) {
      await adminFetch("/logout", token, { method: "POST" }).catch(() => null);
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.replace("/admin/login");
  }

  if (!token) {
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
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const tabProps = {
    token,
    notify,
    onReload: loadAll,
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
            const active = tab === t.id || (t.id === "content" && tab === "settings");
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
          <button
            type="button"
            onClick={() => {
              setTab("settings");
              setSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              tab === "settings"
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="h-[18px] w-[18px] text-white/40" strokeWidth={2} />
            Setting
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
            {loading && <Spinner className="h-4 w-4" />}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <ProfileMenu
              user={user}
              onProfile={() => setTab("profile")}
              onSettings={() => setTab("settings")}
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
          {tab === "settings" && (
            <ContentTab
              settings={settings}
              {...tabProps}
              title="Setting"
              description="Website-Texte, Kontakt und Bilder verwalten."
            />
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
