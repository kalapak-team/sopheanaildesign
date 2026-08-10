"""Generate a professional Admin Dashboard layout diagram for client docs."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(r"e:\PROJECT_STANDARD_2026\sopheanaildesign\docs\images\admin-dashboard-layout.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1400, 820
PINK = (233, 30, 99)
PINK_SOFT = (252, 228, 236)
DARK = (33, 33, 33)
GRAY = (97, 97, 97)
LIGHT = (245, 245, 245)
WHITE = (255, 255, 255)
BORDER = (224, 224, 224)
GREEN = (46, 125, 50)
RED = (198, 40, 40)

img = Image.new("RGB", (W, H), (250, 250, 250))
d = ImageDraw.Draw(img)


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


f_title = font(22, True)
f_h = font(18, True)
f_body = font(15)
f_small = font(13)
f_tiny = font(11)
f_label = font(12, True)


def round_rect(xy, radius, fill, outline=None, width=1):
    d.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def shadow_rect(xy, radius=16):
    x1, y1, x2, y2 = xy
    for i, a in enumerate((236, 240, 244)):
        round_rect((x1 - i, y1 - i + 2, x2 + i, y2 + i + 2), radius + i, (a, a, a))


# Caption
d.text((40, 22), "Admin Dashboard Layout", font=f_title, fill=DARK)
d.text((40, 52), "Sophea Naildesign  ·  How the Admin screen is organized", font=f_small, fill=GRAY)

# Outer card
card = (40, 90, 1360, 780)
shadow_rect(card, 18)
round_rect(card, 18, WHITE, BORDER, 2)

# Sidebar
sb = (40, 90, 320, 780)
round_rect(sb, 18, WHITE)
# clip left rounded only visually by covering right edge
d.rectangle((300, 91, 320, 779), fill=WHITE)
d.line((320, 90, 320, 780), fill=BORDER, width=2)

# Brand header
round_rect((56, 110, 304, 170), 12, PINK)
d.text((72, 124), "Sophea Admin", font=f_h, fill=WHITE)
d.text((72, 148), "Naildesign Dashboard", font=f_tiny, fill=(255, 220, 235))

# Nav items
nav = [
    ("Overview", True),
    ("Preise", False),
    ("Aktionen", False),
    ("Öffnungszeiten", False),
    ("Messages", False),
    ("Settings", False),
]
y = 190
for label, active in nav:
    box = (56, y, 304, y + 44)
    if active:
        round_rect(box, 10, PINK)
        color = WHITE
        # white bullet
        d.ellipse((72, y + 16, 84, y + 28), fill=WHITE)
    else:
        color = DARK
        d.ellipse((72, y + 16, 84, y + 28), outline=GRAY, width=2)
    d.text((96, y + 12), label, font=f_body, fill=color)
    y += 52

# Sidebar footer
d.line((56, 660, 304, 660), fill=BORDER, width=1)
d.text((72, 680), "↗  View site", font=f_body, fill=GRAY)
d.text((72, 720), "↪  Logout", font=f_body, fill=RED)

# Callout badge: SIDEBAR
round_rect((56, 742, 150, 768), 8, PINK_SOFT)
d.text((70, 746), "SIDEBAR", font=f_label, fill=PINK)

# Top bar
d.rectangle((321, 90, 1360, 160), fill=WHITE)
d.line((321, 160, 1360, 160), fill=BORDER, width=2)
d.text((350, 112), "Overview", font=f_h, fill=DARK)
d.text((350, 136), "Current section title", font=f_tiny, fill=GRAY)
# user chip
round_rect((1200, 112, 1325, 142), 16, LIGHT, BORDER)
d.ellipse((1210, 118, 1234, 142), fill=PINK)
d.text((1242, 118), "Admin", font=f_small, fill=DARK)

round_rect((1220, 70, 1320, 96), 8, PINK_SOFT)
d.text((1232, 74), "TOP BAR", font=f_label, fill=PINK)

# Main content area background
d.rectangle((321, 161, 1360, 780), fill=(252, 252, 252))

# Stat cards
stats = [
    ("Categories", "6", (33, 150, 243)),
    ("Services", "22", (156, 39, 176)),
    ("Promotions", "3", PINK),
    ("Messages", "0", (255, 152, 0)),
]
x0 = 350
for title, value, color in stats:
    box = (x0, 190, x0 + 230, 300)
    round_rect(box, 14, WHITE, BORDER, 2)
    d.text((x0 + 18, 208), title.upper(), font=f_tiny, fill=GRAY)
    round_rect((x0 + 170, 205, x0 + 210, 245), 8, (*color[:3],) if False else (color[0], color[1], color[2]))
    # softer icon plate
    plate = Image.new("RGBA", (40, 40), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plate)
    pd.rounded_rectangle((0, 0, 39, 39), 8, fill=(*color, 28))
    img.paste(plate, (x0 + 170, 205), plate)
    d.ellipse((x0 + 182, 217, x0 + 198, 233), fill=color)
    d.text((x0 + 18, 240), value, font=font(36, True), fill=DARK)
    x0 += 250

# Status strip
round_rect((350, 320, 1330, 370), 12, WHITE, BORDER, 2)
d.ellipse((370, 338, 386, 354), fill=GREEN)
d.text((400, 335), "Public API online   ·   Phone: 079 827 94 98", font=f_body, fill=GRAY)

# Content placeholder panel
round_rect((350, 400, 1330, 720), 14, WHITE, BORDER, 2)
d.text((370, 420), "Main content area", font=f_h, fill=DARK)
d.text((370, 450), "This area changes when you click a menu item:", font=f_small, fill=GRAY)

# Mini feature cards explaining modules
modules = [
    ("Preise", "Edit service prices"),
    ("Aktionen", "Update promotions"),
    ("Öffnungszeiten", "Change opening hours"),
    ("Messages", "Read visitor messages"),
    ("Settings", "Business info & texts"),
]
mx, my = 370, 500
for i, (name, desc) in enumerate(modules):
    col = i % 3
    row = i // 3
    bx = mx + col * 310
    by = my + row * 90
    round_rect((bx, by, bx + 290, by + 72), 12, PINK_SOFT if i == 0 else LIGHT, BORDER, 1)
    d.text((bx + 16, by + 14), name, font=f_body, fill=PINK if i < 3 else DARK)
    d.text((bx + 16, by + 40), desc, font=f_small, fill=GRAY)

round_rect((350, 740, 520, 768), 8, PINK_SOFT)
d.text((364, 744), "MAIN CONTENT", font=f_label, fill=PINK)

img.save(OUT, "PNG", optimize=True)
print(f"Saved {OUT}")
