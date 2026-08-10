"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Images } from "lucide-react";
import { adminFetch } from "./api";
import { ImageUpload } from "./ImageUpload";
import { Modal, ModalActions } from "./Modal";
import { mediaUrl } from "./media";
import {
  Card,
  SectionHeader,
  Field,
  Btn,
  Toggle,
  EmptyState,
  inputClass,
} from "./ui";
import type { HeroSlide, NotifyFn } from "./types";

type SlideForm = {
  title: string;
  subtitle: string;
  image_path: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm: SlideForm = {
  title: "",
  subtitle: "",
  image_path: "",
  sort_order: 0,
  is_active: true,
};

function toForm(slide: HeroSlide): SlideForm {
  return {
    title: slide.title ?? "",
    subtitle: slide.subtitle ?? "",
    image_path: slide.image_path,
    sort_order: slide.sort_order ?? 0,
    is_active: slide.is_active ?? true,
  };
}

export function HeroSlidesTab({
  token,
  slides,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  slides: HeroSlide[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SlideForm>(emptyForm);
  const [busy, setBusy] = useState(false);

  async function request(path: string, options: Parameters<typeof adminFetch>[2]) {
    const res = await adminFetch(path, token, options);
    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    return res;
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      sort_order: slides.length ? Math.max(...slides.map((s) => s.sort_order)) + 1 : 0,
    });
    setModalOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm(toForm(slide));
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit() {
    if (!form.image_path.trim()) {
      notify("error", "Bild ist erforderlich");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        title: form.title || null,
        subtitle: form.subtitle || null,
        image_path: form.image_path,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      const res = await request(
        editingId ? `/hero-slides/${editingId}` : "/hero-slides",
        {
          method: editingId ? "PUT" : "POST",
          json: payload,
        }
      );
      if (!res) return;
      if (!res.ok) {
        notify("error", editingId ? "Speichern fehlgeschlagen" : "Erstellen fehlgeschlagen");
        return;
      }
      notify("success", editingId ? "Slide gespeichert" : "Hero-Slide erstellt");
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Diesen Slide löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/hero-slides/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Slide gelöscht");
      if (editingId === id) closeModal();
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  const isEdit = editingId !== null;

  return (
    <div>
      <SectionHeader
        title="Hero Slides"
        description="Kompakte Liste — zum Bearbeiten auf Bearbeiten klicken."
        action={
          <Btn onClick={openCreate} variant="secondary">
            <Plus className="h-4 w-4" />
            Neuer Slide
          </Btn>
        }
      />

      <Modal
        open={modalOpen}
        title={isEdit ? "Slide bearbeiten" : "Neuer Slide"}
        description="Hero-Carousel Bild und Texte."
        onClose={closeModal}
        footer={
          <ModalActions
            onCancel={closeModal}
            onSubmit={submit}
            submitLabel={isEdit ? "Speichern" : "Erstellen"}
            busy={busy}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titel">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Untertitel">
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </Field>
          <Field label="Bild *" className="sm:col-span-2">
            <ImageUpload
              token={token}
              value={form.image_path}
              onChange={(path) => setForm({ ...form, image_path: path })}
              folder="hero"
              label="Hero-Bild"
              onUnauthorized={handleUnauthorized}
              onError={(m) => notify("error", m)}
            />
          </Field>
          <Field label="Reihenfolge">
            <input
              type="number"
              className={inputClass}
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: Number(e.target.value) })
              }
            />
          </Field>
          <div className="flex items-end pb-1">
            <Toggle
              checked={form.is_active}
              onChange={(v) => setForm({ ...form, is_active: v })}
              label="Aktiv"
            />
          </div>
        </div>
      </Modal>

      {slides.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Keine Hero-Slides"
          description="Erstelle den ersten Slide für die Startseite."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {slides
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((slide) => {
                const thumb = mediaUrl(slide.image_path);
                return (
                  <li
                    key={slide.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-5"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {slide.title || "Ohne Titel"}
                      </p>
                      <p className="truncate text-xs text-neutral-400">
                        {slide.subtitle || slide.image_path}
                      </p>
                    </div>
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                      #{slide.sort_order}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        slide.is_active !== false
                          ? "bg-brand-pink/10 text-brand-pink"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {slide.is_active !== false ? "Aktiv" : "Inaktiv"}
                    </span>
                    <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                      <Btn
                        variant="ghost"
                        className="!px-2.5"
                        onClick={() => openEdit(slide)}
                      >
                        <Pencil className="h-4 w-4" />
                        Bearbeiten
                      </Btn>
                      <Btn
                        variant="ghost"
                        className="!px-2.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => remove(slide.id)}
                        disabled={busy}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Btn>
                    </div>
                  </li>
                );
              })}
          </ul>
        </Card>
      )}
    </div>
  );
}
