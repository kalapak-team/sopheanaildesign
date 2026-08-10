"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { ToastState } from "./types";
import { poppins } from "./types";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/40 ${className}`}
      style={poppins}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3" style={poppins}>
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`} style={poppins}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20";

export const textareaClass = `${inputClass} min-h-[88px] resize-y`;

export function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary:
      "bg-brand-pink text-white hover:bg-brand-pink-hot shadow-sm shadow-brand-pink/25",
    secondary:
      "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles} ${className}`}
      style={poppins}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2"
      style={poppins}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          checked ? "bg-brand-pink" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      {label && <span className="text-sm text-neutral-600">{label}</span>}
    </button>
  );
}

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl animate-[fade-up_0.3s_ease] ${
        toast.type === "success" ? "bg-[#151515] text-white" : "bg-red-600 text-white"
      }`}
      style={poppins}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-pink" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      {toast.message}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Icon className="h-8 w-8 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      {description && <p className="text-xs text-neutral-400">{description}</p>}
    </Card>
  );
}

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return <Loader2 className={`animate-spin text-brand-pink ${className}`} />;
}

export function SaveBar({
  onSave,
  saving,
  label = "Speichern",
}: {
  onSave: () => void;
  saving?: boolean;
  label?: string;
}) {
  return (
    <div className="flex justify-end border-t border-neutral-100 bg-neutral-50/80 px-4 py-3">
      <Btn onClick={onSave} disabled={saving}>
        {saving && <Spinner className="h-4 w-4 text-white" />}
        {label}
      </Btn>
    </div>
  );
}
