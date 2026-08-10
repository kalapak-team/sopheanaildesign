"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Clock } from "lucide-react";
import { adminFetch } from "./api";
import { Modal, ModalActions } from "./Modal";
import {
  Card,
  SectionHeader,
  Field,
  Btn,
  Toggle,
  EmptyState,
  inputClass,
} from "./ui";
import type { OpeningHour, NotifyFn } from "./types";

type HoursForm = {
  day_label: string;
  hours: string;
  sort_order: number;
  is_active: boolean;
};

const empty: HoursForm = {
  day_label: "",
  hours: "",
  sort_order: 0,
  is_active: true,
};

function toForm(h: OpeningHour): HoursForm {
  return {
    day_label: h.day_label ?? "",
    hours: h.hours ?? "",
    sort_order: h.sort_order ?? 0,
    is_active: h.is_active ?? true,
  };
}

export function HoursTab({
  token,
  hours,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  hours: OpeningHour[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HoursForm>(empty);
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
      sort_order: hours.length
        ? Math.max(...hours.map((h) => h.sort_order)) + 1
        : 1,
    });
    setModalOpen(true);
  }

  function openEdit(h: OpeningHour) {
    setEditingId(h.id);
    setForm(toForm(h));
    setModalOpen(true);
  }

  function closeModal() {
    if (busy) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(empty);
  }

  async function submit() {
    if (!form.day_label.trim() || !form.hours.trim()) {
      notify("error", "Tag und Zeiten erforderlich");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        day_label: form.day_label,
        hours: form.hours,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };
      const res = await request(
        editingId ? `/opening-hours/${editingId}` : "/opening-hours",
        {
          method: editingId ? "PUT" : "POST",
          json: payload,
        }
      );
      if (!res) return;
      if (!res.ok) {
        notify(
          "error",
          editingId ? "Speichern fehlgeschlagen" : "Erstellen fehlgeschlagen"
        );
        return;
      }
      notify(
        "success",
        editingId ? "Öffnungszeit gespeichert" : "Öffnungszeit erstellt"
      );
      setModalOpen(false);
      setEditingId(null);
      setForm(empty);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Diesen Eintrag löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/opening-hours/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Gelöscht");
      if (editingId === id) {
        setModalOpen(false);
        setEditingId(null);
        setForm(empty);
      }
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  const isEdit = editingId !== null;

  return (
    <div>
      <SectionHeader
        title="Öffnungszeiten"
        description="Kompakte Liste — Bearbeiten öffnet das Formular."
        action={
          <Btn onClick={openCreate} variant="secondary">
            <Plus className="h-4 w-4" />
            Hinzufügen
          </Btn>
        }
      />

      <Modal
        open={modalOpen}
        title={isEdit ? "Öffnungszeit bearbeiten" : "Öffnungszeit hinzufügen"}
        description="Tag und Zeiten für Footer / Kontakt."
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
          <Field label="Tag *">
            <input
              className={inputClass}
              placeholder="Montag"
              value={form.day_label}
              onChange={(e) => setForm({ ...form, day_label: e.target.value })}
            />
          </Field>
          <Field label="Zeiten *">
            <input
              className={inputClass}
              placeholder="09:00 – 19:00"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
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

      {hours.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Keine Öffnungszeiten"
          description="Füge die ersten Zeiten hinzu."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {hours
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((h) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {h.day_label}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{h.hours}</p>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                    #{h.sort_order}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      h.is_active !== false
                        ? "bg-brand-pink/10 text-brand-pink"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {h.is_active !== false ? "Aktiv" : "Inaktiv"}
                  </span>
                  <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                    <Btn
                      variant="ghost"
                      className="!px-2.5"
                      onClick={() => openEdit(h)}
                    >
                      <Pencil className="h-4 w-4" />
                      Bearbeiten
                    </Btn>
                    <Btn
                      variant="ghost"
                      className="!px-2.5 text-red-600 hover:bg-red-50"
                      onClick={() => remove(h.id)}
                      disabled={busy}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Btn>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
