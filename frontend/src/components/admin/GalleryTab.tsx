"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Images } from "lucide-react";
import { adminFetch } from "./api";
import { ImageUpload } from "./ImageUpload";
import { Modal, ModalActions } from "./Modal";
import { mediaUrl } from "./media";
import {
  SectionHeader,
  Field,
  Btn,
  Toggle,
  EmptyState,
  inputClass,
} from "./ui";
import type { GalleryImage, NotifyFn } from "./types";

type GalleryForm = {
  title: string;
  image_path: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
};

const empty: GalleryForm = {
  title: "",
  image_path: "",
  alt_text: "",
  sort_order: 0,
  is_active: true,
};

function toForm(item: GalleryImage): GalleryForm {
  return {
    title: item.title ?? "",
    image_path: item.image_path,
    alt_text: item.alt_text ?? "",
    sort_order: item.sort_order ?? 0,
    is_active: item.is_active ?? true,
  };
}

export function GalleryTab({
  token,
  gallery,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  gallery: GalleryImage[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GalleryForm>(empty);
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
      ...empty,
      sort_order: gallery.length
        ? Math.max(...gallery.map((g) => g.sort_order)) + 1
        : 0,
    });
    setModalOpen(true);
  }

  function openEdit(item: GalleryImage) {
    setEditingId(item.id);
    setForm(toForm(item));
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(empty);
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
        image_path: form.image_path,
        alt_text: form.alt_text || null,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      const res = await request(
        editingId ? `/gallery/${editingId}` : "/gallery",
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
      notify("success", editingId ? "Bild gespeichert" : "Bild hinzugefügt");
      setModalOpen(false);
      setEditingId(null);
      setForm(empty);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Dieses Bild löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/gallery/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Bild gelöscht");
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
        title="Galerie"
        description="Grid-Ansicht — Klick auf Bearbeiten öffnet das Formular."
        action={
          <Btn onClick={openCreate} variant="secondary">
            <Plus className="h-4 w-4" />
            Neues Bild
          </Btn>
        }
      />

      <Modal
        open={modalOpen}
        title={isEdit ? "Bild bearbeiten" : "Neues Bild"}
        description="Galerie-Bild und Metadaten."
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
          <Field label="Alt-Text">
            <input
              className={inputClass}
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
            />
          </Field>
          <Field label="Bild *" className="sm:col-span-2">
            <ImageUpload
              token={token}
              value={form.image_path}
              onChange={(path) => setForm({ ...form, image_path: path })}
              folder="gallery"
              label="Galerie-Bild"
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

      {gallery.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Galerie leer"
          description="Füge das erste Galerie-Bild hinzu."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => {
              const thumb = mediaUrl(item.image_path);
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={item.alt_text || item.title || ""}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.is_active !== false
                          ? "bg-brand-pink text-white"
                          : "bg-neutral-800/70 text-white"
                      }`}
                    >
                      {item.is_active !== false ? "Aktiv" : "Aus"}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {item.title || "Ohne Titel"}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <Btn
                        variant="ghost"
                        className="!px-2 !py-1.5 text-xs"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Bearbeiten
                      </Btn>
                      <Btn
                        variant="ghost"
                        className="!px-2 !py-1.5 text-red-600 hover:bg-red-50"
                        onClick={() => remove(item.id)}
                        disabled={busy}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Btn>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
