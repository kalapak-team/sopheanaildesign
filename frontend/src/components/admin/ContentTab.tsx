"use client";

import { useEffect, useState } from "react";
import { Pencil, FileText, ImageIcon, Type, Phone, BookOpen, Quote } from "lucide-react";
import { adminFetch } from "./api";
import { ImageUpload } from "./ImageUpload";
import { Modal, ModalActions } from "./Modal";
import {
  Card,
  SectionHeader,
  Field,
  Btn,
  inputClass,
  textareaClass,
  Spinner,
} from "./ui";
import type { SiteSettings, NotifyFn } from "./types";

type GroupField = {
  key: string;
  label: string;
  multiline?: boolean;
  image?: boolean;
};

type Group = {
  id: string;
  title: string;
  description: string;
  icon: typeof Phone;
  keys: GroupField[];
};

const GROUPS: Group[] = [
  {
    id: "contact",
    title: "Kontakt",
    description: "Telefon, Adresse und Social Links",
    icon: Phone,
    keys: [
      { key: "business_name", label: "Geschäftsname" },
      { key: "phone", label: "Telefon" },
      { key: "phone_intl", label: "Telefon (international)" },
      { key: "address_line1", label: "Adresse Zeile 1" },
      { key: "address_line2", label: "Adresse Zeile 2" },
      { key: "website_url", label: "Website URL" },
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
      { key: "instagram_handle", label: "Instagram Handle" },
      { key: "instagram_posts", label: "Instagram Posts" },
      { key: "instagram_followers", label: "Instagram Followers" },
      { key: "instagram_following", label: "Instagram Following" },
    ],
  },
  {
    id: "images",
    title: "Website-Bilder",
    description: "Hintergrund- und Sektionsbilder",
    icon: ImageIcon,
    keys: [
      { key: "dark_hero_image", label: "Dark Hero Hintergrund", image: true },
      { key: "services_bg_image", label: "Dienstleistungen Hintergrund", image: true },
      { key: "services_nail_image", label: "Dienstleistungen Nail Bild", image: true },
      { key: "about_portrait_image", label: "About Portrait", image: true },
      { key: "study_image", label: "Studie Bild", image: true },
      { key: "preisliste_image", label: "Preisliste Bild", image: true },
      { key: "preisliste_bg_image", label: "Preisliste Hintergrund", image: true },
      { key: "logo_image", label: "Logo", image: true },
      { key: "logo_full_image", label: "Logo Full (Nav)", image: true },
      { key: "logo_footer_image", label: "Logo Footer", image: true },
    ],
  },
  {
    id: "hero",
    title: "Hero",
    description: "Tagline über dem Hero-Bereich",
    icon: Quote,
    keys: [{ key: "hero_tagline", label: "Hero Tagline", multiline: true }],
  },
  {
    id: "about",
    title: "Über uns",
    description: "About- und About-me-Texte",
    icon: BookOpen,
    keys: [
      { key: "about_title", label: "About Titel" },
      { key: "about_subtitle", label: "About Untertitel" },
      { key: "about_body", label: "About Text", multiline: true },
      { key: "about_me_title", label: "About Me Titel" },
      { key: "about_me_subtitle", label: "About Me Untertitel" },
      { key: "about_me_body", label: "About Me Text", multiline: true },
    ],
  },
  {
    id: "study",
    title: "Studie",
    description: "Study-Sektion",
    icon: Type,
    keys: [
      { key: "study_label", label: "Label" },
      { key: "study_title", label: "Titel" },
      { key: "study_body", label: "Text", multiline: true },
    ],
  },
  {
    id: "headings",
    title: "Überschriften & Footer",
    description: "Sektions-Überschriften und Copyright",
    icon: FileText,
    keys: [
      { key: "promotions_heading", label: "Aktionen Überschrift" },
      { key: "social_heading", label: "Instagram / Social Überschrift" },
      { key: "copyright", label: "Copyright" },
    ],
  },
];

function previewFor(group: Group, settings: SiteSettings): string {
  for (const field of group.keys) {
    const v = (settings[field.key] || "").trim();
    if (!v) continue;
    if (field.image) return v.split("/").pop() || v;
    return v.length > 72 ? `${v.slice(0, 72)}…` : v;
  }
  return "Noch leer";
}

export function ContentTab({
  token,
  settings,
  notify,
  onReload,
  handleUnauthorized,
  title = "Inhalte",
  description = "Kompakte Liste — Bearbeiten öffnet das Formular.",
}: {
  token: string;
  settings: SiteSettings;
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
  title?: string;
  description?: string;
}) {
  const [draft, setDraft] = useState<SiteSettings>({});
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  useEffect(() => {
    setDraft({ ...settings });
    setJsonText(JSON.stringify(settings, null, 2));
  }, [settings]);

  const activeGroup = GROUPS.find((g) => g.id === activeGroupId) ?? null;

  function setKey(key: string, value: string) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function openGroup(id: string) {
    setDraft({ ...settings });
    setActiveGroupId(id);
  }

  function closeModal() {
    if (saving) return;
    setActiveGroupId(null);
    setDraft({ ...settings });
  }

  async function saveGroup(group: Group) {
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const k of group.keys) {
        payload[k.key] = draft[k.key] ?? "";
      }
      const res = await adminFetch("/settings", token, {
        method: "PUT",
        json: { settings: payload },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        notify("error", "Speichern fehlgeschlagen");
        return;
      }
      notify("success", `${group.title} gespeichert`);
      setActiveGroupId(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function saveJson() {
    setSaving(true);
    try {
      const parsed = JSON.parse(jsonText) as SiteSettings;
      const res = await adminFetch("/settings", token, {
        method: "PUT",
        json: { settings: parsed },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        notify("error", "JSON speichern fehlgeschlagen");
        return;
      }
      notify("success", "Settings gespeichert");
      setShowJson(false);
      await onReload();
    } catch {
      notify("error", "JSON ungültig");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SectionHeader
        title={title}
        description={description}
        action={
          <Btn variant="ghost" onClick={() => setShowJson((v) => !v)}>
            <FileText className="h-4 w-4" />
            {showJson ? "Liste" : "JSON (Advanced)"}
          </Btn>
        }
      />

      {showJson ? (
        <Card className="overflow-hidden">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={20}
            spellCheck={false}
            className="w-full resize-y bg-[#151515] p-4 font-mono text-xs leading-relaxed text-neutral-100 focus:outline-none"
          />
          <div className="flex justify-end border-t border-neutral-100 bg-neutral-50/80 px-4 py-3">
            <Btn onClick={saveJson} disabled={saving}>
              {saving && <Spinner className="h-4 w-4 text-white" />}
              JSON speichern
            </Btn>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <li
                  key={group.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:flex-nowrap sm:gap-4 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900">
                      {group.title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {previewFor(group, settings)}
                    </p>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                    {group.keys.length} Felder
                  </span>
                  <Btn
                    variant="ghost"
                    className="!px-2.5"
                    onClick={() => openGroup(group.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                  </Btn>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Modal
        open={!!activeGroup}
        title={activeGroup?.title ?? ""}
        description={activeGroup?.description}
        wide={activeGroup?.id === "images" || activeGroup?.id === "about"}
        onClose={closeModal}
        footer={
          activeGroup ? (
            <ModalActions
              onCancel={closeModal}
              onSubmit={() => void saveGroup(activeGroup)}
              submitLabel="Speichern"
              busy={saving}
            />
          ) : null
        }
      >
        {activeGroup ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeGroup.keys.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                className={field.multiline || field.image ? "sm:col-span-2" : ""}
              >
                {field.image ? (
                  <ImageUpload
                    token={token}
                    value={draft[field.key] ?? ""}
                    onChange={(path) => setKey(field.key, path)}
                    folder="site"
                    label={field.label}
                    onUnauthorized={handleUnauthorized}
                    onError={(m) => notify("error", m)}
                  />
                ) : field.multiline ? (
                  <textarea
                    className={textareaClass}
                    rows={5}
                    value={draft[field.key] ?? ""}
                    onChange={(e) => setKey(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={draft[field.key] ?? ""}
                    onChange={(e) => setKey(field.key, e.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
