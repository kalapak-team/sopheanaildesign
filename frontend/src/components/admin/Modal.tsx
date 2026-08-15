"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Btn, Spinner } from "./ui";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  wide = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[var(--admin-overlay,#1515158c)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`relative z-10 flex max-h-[min(90vh,880px)] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl shadow-black/20 ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="admin-modal-title"
              className="text-lg font-semibold text-neutral-900"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Schliessen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-neutral-100 bg-neutral-50/90 px-5 py-3.5 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ModalActions({
  onCancel,
  onSubmit,
  submitLabel = "Speichern",
  cancelLabel = "Abbrechen",
  busy,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
}) {
  return (
    <>
      <Btn onClick={onSubmit} disabled={busy}>
        {busy ? <Spinner className="h-4 w-4 text-white" /> : null}
        {submitLabel}
      </Btn>
      <Btn variant="secondary" onClick={onCancel} disabled={busy}>
        {cancelLabel}
      </Btn>
    </>
  );
}
