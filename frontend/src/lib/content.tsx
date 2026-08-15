import type { ReactNode } from "react";
import { EXTERNAL_REL } from "@/lib/site";

// first word stays black, the rest goes pink
export function TitleWithAccent({
  text,
  className = "text-brand-pink",
}: {
  text: string;
  className?: string;
}): ReactNode {
  const trimmed = (text || "").trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return trimmed;
  return (
    <>
      {parts[0]}{" "}
      <span className={className}>{parts.slice(1).join(" ")}</span>
    </>
  );
}

// **this** becomes pink bold; optional link on "Studie"
export function RichPlainText({
  text,
  linkUrl,
  linkLabel = "Studie",
}: {
  text: string;
  linkUrl?: string;
  linkLabel?: string;
}): ReactNode {
  if (!text) return null;

  const withMarks = text.split(/(\*\*[^*]+\*\*)/g).flatMap((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return [
        <span key={`m-${i}`} className="font-bold text-brand-pink">
          {chunk.slice(2, -2)}
        </span>,
      ];
    }
    if (!linkUrl) return [chunk];

    return chunk.split(new RegExp(`(${escapeRegExp(linkLabel)})`, "g")).map((part, j) =>
      part === linkLabel ? (
        <a
          key={`l-${i}-${j}`}
          href={linkUrl}
          target="_blank"
          rel={EXTERNAL_REL}
          className="text-brand-pink underline"
        >
          {linkLabel}
        </a>
      ) : (
        part
      )
    );
  });

  return <>{withMarks}</>;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type StudyBenefit = { title: string; text: string };

export function studyBenefitsFromSettings(
  settings: Record<string, string>
): StudyBenefit[] {
  const items: StudyBenefit[] = [];
  for (let i = 1; i <= 4; i++) {
    const title = (settings[`study_benefit_${i}_title`] || "").trim();
    const text = (settings[`study_benefit_${i}_text`] || "").trim();
    if (title || text) items.push({ title, text });
  }
  return items;
}
