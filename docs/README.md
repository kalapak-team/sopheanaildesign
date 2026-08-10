# Documentation Package — Sophea Naildesign

Professional client documents prepared by **Kalapak Team**.

| Document | Audience | Description |
|----------|----------|-------------|
| **[CLIENT_DELIVERY.docx](./CLIENT_DELIVERY.docx)** | Client / stakeholders | **Microsoft Word** — full project delivery document |
| **[ADMIN_USER_GUIDE.docx](./ADMIN_USER_GUIDE.docx)** | Salon owner / staff | **Microsoft Word** — Admin CMS user guide |
| [CLIENT_DELIVERY.md](./CLIENT_DELIVERY.md) | — | Markdown source (same content) |
| [ADMIN_USER_GUIDE.md](./ADMIN_USER_GUIDE.md) | — | Markdown source (same content) |
| [../README.md](../README.md) | Developers | Technical quick start |

---

## Send to client (easiest)

1. Open these Word files in Microsoft Word:
   - `docs/CLIENT_DELIVERY.docx`
   - `docs/ADMIN_USER_GUIDE.docx`
2. Optionally **File → Save As → PDF** if you prefer PDF.
3. Email the Word or PDF files to the client.
4. Send the temporary admin password in a **separate** private message.

---

## Suggested email to client

**Subject:** Sophea Naildesign — Project Delivery Package

Dear [Client Name],

Please find attached the delivery documentation for your new Sophea Naildesign website and Admin system.

Included:
1. Project Delivery Document (scope, features, acceptance checklist)  
2. Admin User Guide (how to update prices, promotions, and opening hours)

Source code repository:  
https://github.com/kalapak-team/sopheanaildesign

We are ready to schedule a short handover call / demo at your convenience.

Best regards,  
Kalapak Team

---

## Regenerate Word files from Markdown

If you edit the `.md` files later, regenerate `.docx` with:

```bash
python docs/md_to_docx.py
```

---

## Customize before sending

- Client legal name / contact person  
- Your company phone / email  
- Warranty period (default suggested: 30 days)  
- Production domain (once known)  

---

*Documentation package version 1.0 — 10 August 2026*
