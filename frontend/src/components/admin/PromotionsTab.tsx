"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Percent } from "lucide-react";
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
  textareaClass,
} from "./ui";
import type { Promotion, NotifyFn } from "./types";

type PromoForm = {
  title: string;
  highlight: string;
  price: string;
  currency: string;
  description: string;
  image_path: string;
  header_style: "dark" | "pink";
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

const empty: PromoForm = {
  title: "",
  highlight: "",
  price: "",
  currency: "CHF",
  description: "",
  image_path: "",
  header_style: "pink",
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

function fromPromo(p: Promotion): PromoForm {
  return {
    title: p.title ?? "",
    highlight: p.highlight ?? "",
    price: String(p.price ?? ""),
    currency: p.currency ?? "CHF",
    description: p.description ?? "",
    image_path: p.image_path ?? "",
    header_style: p.header_style ?? "pink",
    is_featured: !!p.is_featured,
    is_active: p.is_active ?? true,
    sort_order: p.sort_order ?? 0,
  };
}

export function PromotionsTab({
  token,
  promotions,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  promotions: Promotion[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PromoForm>(empty);
  const [busy, setBusy] = useState(false);

  async function request(path: string, options: Parameters<typeof adminFetch>[2]) {
    const res = await adminFetch(path, token, options);
    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    return res;
  }

  function payload(f: PromoForm) {
    return {
      title: f.title,
      highlight: f.highlight || null,
      price: Number(f.price),
      currency: f.currency || "CHF",
      description: f.description || null,
      image_path: f.image_path || null,
      header_style: f.header_style,
      is_featured: f.is_featured,
      is_active: f.is_active,
      sort_order: Number(f.sort_order) || 0,
    };
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...empty,
      sort_order: promotions.length
        ? Math.max(...promotions.map((p) => p.sort_order)) + 1
        : 0,
    });
    setModalOpen(true);
  }

  function openEdit(p: Promotion) {
    setEditingId(p.id);
    setForm(fromPromo(p));
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(empty);
  }

  async function submit() {
    if (!form.title.trim() || form.price === "") {
      notify("error", "Titel und Preis erforderlich");
      return;
    }
    setBusy(true);
    try {
      const res = await request(
        editingId ? `/promotions/${editingId}` : "/promotions",
        {
          method: editingId ? "PUT" : "POST",
          json: payload(form),
        }
      );
      if (!res) return;
      if (!res.ok) {
        notify("error", editingId ? "Speichern fehlgeschlagen" : "Erstellen fehlgeschlagen");
        return;
      }
      notify("success", editingId ? "Aktion gespeichert" : "Aktion erstellt");
      setModalOpen(false);
      setEditingId(null);
      setForm(empty);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Diese Aktion löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/promotions/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Aktion gelöscht");
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
        title="Aktionen"
        description="Kompakte Liste — Bearbeiten öffnet das Formular."
        action={
          <Btn onClick={openCreate} variant="secondary">
            <Plus className="h-4 w-4" />
            Neue Aktion
          </Btn>
        }
      />

      <Modal
        open={modalOpen}
        title={isEdit ? "Aktion bearbeiten" : "Neue Aktion"}
        description="Promotion / Sonderangebot."
        wide
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
          <Field label="Titel *">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Highlight">
            <input
              className={inputClass}
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
            />
          </Field>
          <Field label="Preis *">
            <input
              className={inputClass}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Field>
          <Field label="Währung">
            <input
              className={inputClass}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </Field>
          <Field label="Bild" className="sm:col-span-2">
            <ImageUpload
              token={token}
              value={form.image_path}
              onChange={(path) => setForm({ ...form, image_path: path })}
              folder="promotions"
              label="Aktions-Bild"
              onUnauthorized={handleUnauthorized}
              onError={(m) => notify("error", m)}
            />
          </Field>
          <Field label="Beschreibung" className="sm:col-span-2">
            <textarea
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Header-Stil">
            <select
              className={inputClass}
              value={form.header_style}
              onChange={(e) =>
                setForm({
                  ...form,
                  header_style: e.target.value as "dark" | "pink",
                })
              }
            >
              <option value="pink">Pink</option>
              <option value="dark">Dark</option>
            </select>
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
          <div className="flex items-end gap-4 pb-1 sm:col-span-2">
            <Toggle
              checked={form.is_featured}
              onChange={(v) => setForm({ ...form, is_featured: v })}
              label="Featured"
            />
            <Toggle
              checked={form.is_active}
              onChange={(v) => setForm({ ...form, is_active: v })}
              label="Aktiv"
            />
          </div>
        </div>
      </Modal>

      {promotions.length === 0 ? (
        <EmptyState
          icon={Percent}
          title="Keine Aktionen"
          description="Erstelle eine Promotion für die Website."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {promotions
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((p) => {
                const thumb = mediaUrl(p.image_path);
                return (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-5"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center text-[10px] font-bold text-white ${
                            p.header_style === "pink"
                              ? "bg-brand-pink"
                              : "bg-[#151515]"
                          }`}
                        >
                          {p.currency} {Math.round(Number(p.price))}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {p.title}{" "}
                        {p.highlight ? (
                          <span className="text-brand-pink">{p.highlight}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {p.currency} {Number(p.price).toFixed(2)}
                        {p.is_featured ? " · Featured" : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        p.is_active !== false
                          ? "bg-brand-pink/10 text-brand-pink"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {p.is_active !== false ? "Aktiv" : "Inaktiv"}
                    </span>
                    <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                      <Btn
                        variant="ghost"
                        className="!px-2.5"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                        Bearbeiten
                      </Btn>
                      <Btn
                        variant="ghost"
                        className="!px-2.5 text-red-600 hover:bg-red-50"
                        onClick={() => remove(p.id)}
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
