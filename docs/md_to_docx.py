"""
Convert Markdown client docs to Microsoft Word (.docx).
"""
from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(r"e:\PROJECT_STANDARD_2026\sopheanaildesign\docs")


def set_run_font(run, name="Calibri", size=11, bold=False, italic=False, color=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color is not None:
        run.font.color.rgb = color


def add_horizontal_line(paragraph):
    p = paragraph._p
    pPr = p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "12")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "C2185B")
    pBdr.append(bottom)
    pPr.append(pBdr)


def add_formatted_runs(paragraph, text, base_size=11):
    """Support **bold**, *italic*, and `code` inline."""
    pattern = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)")
    parts = pattern.split(text)
    for part in parts:
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            run = paragraph.add_run(part[2:-2])
            set_run_font(run, size=base_size, bold=True)
        elif part.startswith("*") and part.endswith("*"):
            run = paragraph.add_run(part[1:-1])
            set_run_font(run, size=base_size, italic=True)
        elif part.startswith("`") and part.endswith("`"):
            run = paragraph.add_run(part[1:-1])
            set_run_font(run, name="Consolas", size=base_size - 1, color=RGBColor(0x33, 0x33, 0x33))
        else:
            # strip markdown links [text](url) -> text (url)
            cleaned = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", part)
            run = paragraph.add_run(cleaned)
            set_run_font(run, size=base_size)


def parse_table_row(line: str) -> list[str]:
    line = line.strip().strip("|")
    return [c.strip() for c in line.split("|")]


def is_table_separator(line: str) -> bool:
    return bool(re.match(r"^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$", line.strip()))


def add_table(doc: Document, rows: list[list[str]]):
    if not rows:
        return
    cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=cols)
    table.style = "Table Grid"
    for i, row in enumerate(rows):
        for j in range(cols):
            cell = table.rows[i].cells[j]
            cell.text = ""
            p = cell.paragraphs[0]
            value = row[j] if j < len(row) else ""
            value = re.sub(r"\*\*([^*]+)\*\*", r"\1", value)
            value = re.sub(r"`([^`]+)`", r"\1", value)
            value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", value)
            run = p.add_run(value)
            set_run_font(run, size=10, bold=(i == 0))
            if i == 0:
                # light pink header feel
                shading = OxmlElement("w:shd")
                shading.set(qn("w:fill"), "FCE4EC")
                shading.set(qn("w:val"), "clear")
                cell._tePr = cell._tc.get_or_add_tcPr()
                cell._tc.get_or_add_tcPr().append(shading)
    doc.add_paragraph()


def convert_md_to_docx(md_path: Path, docx_path: Path, title: str):
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    doc = Document()

    # Page margins
    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Cover title from first H1
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Image: ![alt](path)
        img_match = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)$", stripped)
        if img_match:
            rel = img_match.group(2).strip()
            img_path = (md_path.parent / rel).resolve()
            if img_path.exists():
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(8)
                run = p.add_run()
                # Fit diagram to page width (~6.3 inches usable)
                run.add_picture(str(img_path), width=Inches(6.3))
                cap = doc.add_paragraph()
                cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cap_run = cap.add_run(img_match.group(1) or "Figure")
                set_run_font(cap_run, size=9, italic=True, color=RGBColor(0x88, 0x88, 0x88))
            else:
                p = doc.add_paragraph()
                add_formatted_runs(p, f"[Image missing: {rel}]", base_size=10)
            i += 1
            continue

        # Code fence
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # closing ```
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run("\n".join(code_lines))
            set_run_font(run, name="Consolas", size=9, color=RGBColor(0x22, 0x22, 0x22))
            continue

        # Horizontal rule
        if stripped in ("---", "***", "___"):
            p = doc.add_paragraph()
            add_horizontal_line(p)
            i += 1
            continue

        # Headings
        heading_match = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if heading_match:
            level = len(heading_match.group(1))
            content = heading_match.group(2).strip()
            content = re.sub(r"\*\*([^*]+)\*\*", r"\1", content)
            # Word heading levels 1-9; map md # -> Word 1
            p = doc.add_heading(content, level=min(level, 3))
            for run in p.runs:
                if level == 1:
                    set_run_font(run, size=22, bold=True, color=RGBColor(0xC2, 0x18, 0x5B))
                elif level == 2:
                    set_run_font(run, size=16, bold=True, color=RGBColor(0x33, 0x33, 0x33))
                else:
                    set_run_font(run, size=13, bold=True, color=RGBColor(0x44, 0x44, 0x44))
            i += 1
            continue

        # Table block
        if stripped.startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            rows = [parse_table_row(stripped)]
            i += 2  # skip header + separator
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(parse_table_row(lines[i]))
                i += 1
            add_table(doc, rows)
            continue

        # Unordered list
        if re.match(r"^[-*]\s+", stripped):
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i].strip()):
                item = re.sub(r"^[-*]\s+", "", lines[i].strip())
                p = doc.add_paragraph(style="List Bullet")
                add_formatted_runs(p, item, base_size=11)
                i += 1
            continue

        # Numbered list
        if re.match(r"^\d+\.\s+", stripped):
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                item = re.sub(r"^\d+\.\s+", "", lines[i].strip())
                p = doc.add_paragraph(style="List Number")
                add_formatted_runs(p, item, base_size=11)
                i += 1
            continue

        # Normal paragraph (merge soft-wrapped? keep line as para for clarity)
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
        add_formatted_runs(p, stripped, base_size=11)
        i += 1

    # Footer note
    section = doc.sections[0]
    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = fp.add_run(f"{title}  ·  Kalapak Team  ·  Confidential")
    set_run_font(run, size=8, color=RGBColor(0x88, 0x88, 0x88))

    doc.save(docx_path)
    print(f"Created: {docx_path}")


def main():
    files = [
        ("CLIENT_DELIVERY.md", "CLIENT_DELIVERY.docx", "Sophea Naildesign — Project Delivery Document"),
        ("ADMIN_USER_GUIDE.md", "ADMIN_USER_GUIDE.docx", "Sophea Naildesign — Admin User Guide"),
    ]
    for md_name, docx_name, title in files:
        convert_md_to_docx(ROOT / md_name, ROOT / docx_name, title)
    print("Done.")


if __name__ == "__main__":
    main()
