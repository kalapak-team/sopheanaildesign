"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Tag } from "lucide-react";
import { adminFetch, slugify } from "./api";
import { Modal, ModalActions } from "./Modal";
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
import type { ServiceCategory, ServiceItem, NotifyFn } from "./types";

type CatForm = {
  name: string;
  subtitle: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

type SvcForm = {
  name: string;
  price: string;
  is_from_price: boolean;
  price_prefix: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

const emptyCat: CatForm = {
  name: "",
  subtitle: "",
  slug: "",
  sort_order: 0,
  is_active: true,
};

const emptySvc: SvcForm = {
  name: "",
  price: "",
  is_from_price: false,
  price_prefix: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

function formatPrice(price: string | number | null | undefined) {
  if (price === null || price === undefined || price === "") return "—";
  const n = Number(price);
  if (Number.isNaN(n)) return "—";
  return `CHF ${n.toFixed(2)}`;
}

export function PreiseTab({
  token,
  categories,
  notify,
  onReload,
  handleUnauthorized,
}: {
  token: string;
  categories: ServiceCategory[];
  notify: NotifyFn;
  onReload: () => Promise<void>;
  handleUnauthorized: () => void;
}) {
  const [catOpen, setCatOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [catForm, setCatForm] = useState<CatForm>(emptyCat);

  const [svcOpen, setSvcOpen] = useState(false);
  const [svcCategoryId, setSvcCategoryId] = useState<number | null>(null);
  const [editingSvcId, setEditingSvcId] = useState<number | null>(null);
  const [svcForm, setSvcForm] = useState<SvcForm>(emptySvc);

  const [busy, setBusy] = useState(false);

  async function request(path: string, options: Parameters<typeof adminFetch>[2]) {
    const res = await adminFetch(path, token, options);
    if (res.status === 401) {
      handleUnauthorized();
      return null;
    }
    return res;
  }

  function openCreateCat() {
    setEditingCatId(null);
    setCatForm({
      ...emptyCat,
      sort_order: categories.length,
    });
    setCatOpen(true);
  }

  function openEditCat(cat: ServiceCategory) {
    setEditingCatId(cat.id);
    setCatForm({
      name: cat.name ?? "",
      subtitle: cat.subtitle ?? "",
      slug: cat.slug ?? "",
      sort_order: cat.sort_order ?? 0,
      is_active: cat.is_active ?? true,
    });
    setCatOpen(true);
  }

  function closeCat() {
    if (busy) return;
    setCatOpen(false);
    setEditingCatId(null);
    setCatForm(emptyCat);
  }

  function openCreateSvc(categoryId: number, servicesCount: number) {
    setSvcCategoryId(categoryId);
    setEditingSvcId(null);
    setSvcForm({ ...emptySvc, sort_order: servicesCount });
    setSvcOpen(true);
  }

  function openEditSvc(categoryId: number, svc: ServiceItem) {
    setSvcCategoryId(categoryId);
    setEditingSvcId(svc.id);
    setSvcForm({
      name: svc.name ?? "",
      price: svc.price === null || svc.price === undefined ? "" : String(svc.price),
      is_from_price: !!svc.is_from_price,
      price_prefix: svc.price_prefix ?? "",
      description: svc.description ?? "",
      sort_order: svc.sort_order ?? 0,
      is_active: svc.is_active ?? true,
    });
    setSvcOpen(true);
  }

  function closeSvc() {
    if (busy) return;
    setSvcOpen(false);
    setSvcCategoryId(null);
    setEditingSvcId(null);
    setSvcForm(emptySvc);
  }

  async function submitCat() {
    if (!catForm.name.trim()) {
      notify("error", "Name erforderlich");
      return;
    }
    const slug = catForm.slug.trim() || slugify(catForm.name);
    setBusy(true);
    try {
      const payload = {
        name: catForm.name,
        subtitle: catForm.subtitle || null,
        slug,
        sort_order: Number(catForm.sort_order) || 0,
        is_active: catForm.is_active,
      };
      const res = await request(
        editingCatId ? `/categories/${editingCatId}` : "/categories",
        {
          method: editingCatId ? "PUT" : "POST",
          json: payload,
        }
      );
      if (!res) return;
      if (!res.ok) {
        notify(
          "error",
          editingCatId
            ? "Kategorie speichern fehlgeschlagen"
            : "Kategorie erstellen fehlgeschlagen"
        );
        return;
      }
      notify("success", editingCatId ? "Kategorie gespeichert" : "Kategorie erstellt");
      setCatOpen(false);
      setEditingCatId(null);
      setCatForm(emptyCat);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function submitSvc() {
    if (!svcForm.name.trim() || svcCategoryId === null) {
      notify("error", "Service-Name erforderlich");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        service_category_id: svcCategoryId,
        name: svcForm.name,
        price: svcForm.price === "" ? null : Number(svcForm.price),
        is_from_price: svcForm.is_from_price,
        price_prefix: svcForm.price_prefix || null,
        description: svcForm.description || null,
        sort_order: Number(svcForm.sort_order) || 0,
        is_active: svcForm.is_active,
      };
      const res = await request(
        editingSvcId ? `/services/${editingSvcId}` : "/services",
        {
          method: editingSvcId ? "PUT" : "POST",
          json: payload,
        }
      );
      if (!res) return;
      if (!res.ok) {
        notify(
          "error",
          editingSvcId
            ? "Service speichern fehlgeschlagen"
            : "Service erstellen fehlgeschlagen"
        );
        return;
      }
      notify("success", editingSvcId ? "Service gespeichert" : "Service erstellt");
      setSvcOpen(false);
      setSvcCategoryId(null);
      setEditingSvcId(null);
      setSvcForm(emptySvc);
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Kategorie und alle Services löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/categories/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Kategorie gelöscht");
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  async function deleteService(id: number) {
    if (!confirm("Diesen Service löschen?")) return;
    setBusy(true);
    try {
      const res = await request(`/services/${id}`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        notify("error", "Löschen fehlgeschlagen");
        return;
      }
      notify("success", "Service gelöscht");
      await onReload();
    } finally {
      setBusy(false);
    }
  }

  const catIsEdit = editingCatId !== null;
  const svcIsEdit = editingSvcId !== null;
  const svcCatName =
    categories.find((c) => c.id === svcCategoryId)?.name ?? "Kategorie";

  return (
    <div>
      <SectionHeader
        title="Preise"
        description="Kompakte Listen — Bearbeiten öffnet das Formular."
        action={
          <Btn onClick={openCreateCat} variant="secondary">
            <Plus className="h-4 w-4" />
            Kategorie
          </Btn>
        }
      />

      <Modal
        open={catOpen}
        title={catIsEdit ? "Kategorie bearbeiten" : "Neue Kategorie"}
        description="Name, Untertitel und Slug der Preiskategorie."
        onClose={closeCat}
        footer={
          <ModalActions
            onCancel={closeCat}
            onSubmit={submitCat}
            submitLabel={catIsEdit ? "Speichern" : "Erstellen"}
            busy={busy}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input
              className={inputClass}
              value={catForm.name}
              onChange={(e) => {
                const name = e.target.value;
                setCatForm({
                  ...catForm,
                  name,
                  slug:
                    !catIsEdit && (!catForm.slug || catForm.slug === slugify(catForm.name))
                      ? slugify(name)
                      : catForm.slug,
                });
              }}
            />
          </Field>
          <Field label="Untertitel">
            <input
              className={inputClass}
              value={catForm.subtitle}
              onChange={(e) => setCatForm({ ...catForm, subtitle: e.target.value })}
            />
          </Field>
          <Field label="Slug" className="sm:col-span-2">
            <input
              className={inputClass}
              value={catForm.slug}
              onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
            />
          </Field>
          <Field label="Reihenfolge">
            <input
              type="number"
              className={inputClass}
              value={catForm.sort_order}
              onChange={(e) =>
                setCatForm({ ...catForm, sort_order: Number(e.target.value) })
              }
            />
          </Field>
          <div className="flex items-end pb-1">
            <Toggle
              checked={catForm.is_active}
              onChange={(v) => setCatForm({ ...catForm, is_active: v })}
              label="Aktiv"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={svcOpen}
        title={svcIsEdit ? "Service bearbeiten" : "Service hinzufügen"}
        description={`${svcCatName} — Name, Preis und Beschreibung.`}
        onClose={closeSvc}
        footer={
          <ModalActions
            onCancel={closeSvc}
            onSubmit={submitSvc}
            submitLabel={svcIsEdit ? "Speichern" : "Hinzufügen"}
            busy={busy}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input
              className={inputClass}
              value={svcForm.name}
              onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })}
            />
          </Field>
          <Field label="Preis (CHF)">
            <input
              className={inputClass}
              value={svcForm.price}
              onChange={(e) => setSvcForm({ ...svcForm, price: e.target.value })}
            />
          </Field>
          <Field label="Preis-Prefix">
            <input
              className={inputClass}
              value={svcForm.price_prefix}
              onChange={(e) =>
                setSvcForm({ ...svcForm, price_prefix: e.target.value })
              }
              placeholder="z.B. ab"
            />
          </Field>
          <Field label="Reihenfolge">
            <input
              type="number"
              className={inputClass}
              value={svcForm.sort_order}
              onChange={(e) =>
                setSvcForm({ ...svcForm, sort_order: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Beschreibung" className="sm:col-span-2">
            <textarea
              className={textareaClass}
              value={svcForm.description}
              onChange={(e) =>
                setSvcForm({ ...svcForm, description: e.target.value })
              }
            />
          </Field>
          <div className="flex items-end gap-4 pb-1 sm:col-span-2">
            <Toggle
              checked={svcForm.is_from_price}
              onChange={(v) => setSvcForm({ ...svcForm, is_from_price: v })}
              label="ab-Preis"
            />
            <Toggle
              checked={svcForm.is_active}
              onChange={(v) => setSvcForm({ ...svcForm, is_active: v })}
              label="Aktiv"
            />
          </div>
        </div>
      </Modal>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Keine Kategorien"
          description="Lege eine Preiskategorie an."
        />
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const services = [...(cat.services ?? [])].sort(
              (a, b) => a.sort_order - b.sort_order
            );
            return (
              <Card key={cat.id} className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 bg-neutral-50/70 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {cat.name}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {cat.subtitle || cat.slug}
                      {" · "}
                      {services.length} Service{services.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Btn
                    variant="ghost"
                    className="!px-2.5"
                    onClick={() => openEditCat(cat)}
                  >
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                  </Btn>
                  <Btn
                    variant="ghost"
                    className="!px-2.5 text-red-600 hover:bg-red-50"
                    onClick={() => deleteCategory(cat.id)}
                    disabled={busy}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Btn>
                </div>

                {services.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-neutral-400">
                    Noch keine Services in dieser Kategorie.
                  </p>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {services.map((svc) => (
                      <li
                        key={svc.id}
                        className="flex flex-wrap items-center gap-3 px-4 py-2.5 sm:flex-nowrap sm:px-5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {svc.name}
                            {svc.is_from_price ? (
                              <span className="ml-1.5 text-xs font-normal text-neutral-400">
                                ab
                              </span>
                            ) : null}
                          </p>
                          {svc.description ? (
                            <p className="truncate text-xs text-neutral-400">
                              {svc.description}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">
                          {formatPrice(svc.price)}
                        </span>
                        <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                          <Btn
                            variant="ghost"
                            className="!px-2.5"
                            onClick={() => openEditSvc(cat.id, svc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Btn>
                          <Btn
                            variant="ghost"
                            className="!px-2.5 text-red-600 hover:bg-red-50"
                            onClick={() => deleteService(svc.id)}
                            disabled={busy}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Btn>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-t border-neutral-100 px-4 py-2.5 sm:px-5">
                  <button
                    type="button"
                    onClick={() => openCreateSvc(cat.id, services.length)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-pink hover:underline"
                  >
                    <Plus className="h-4 w-4" />
                    Service hinzufügen
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
