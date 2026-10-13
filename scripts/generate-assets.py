"""Rebuild the text-free 1200x630 social card. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
out = ROOT / "assets" / "og-card.png"
img = Image.new("RGB", (1200, 630), "#181c19")
d = ImageDraw.Draw(img)

# Operations-binder grid and tab edge. No text is baked into the image.
for x in range(72, 1130, 72):
    d.line((x, 72, x, 558), fill="#323a34", width=2)
for y in range(72, 559, 72):
    d.line((72, y, 1128, y), fill="#323a34", width=2)
d.rectangle((72, 72, 1128, 558), outline="#8e978f", width=3)
d.rectangle((72, 72, 105, 558), fill="#f5f2e8")

# Signal-light system and incident path.
colors = ["#55a97b", "#d69a43", "#d1685e"]
centers = [(350, 315), (600, 315), (850, 315)]
d.line((350, 315, 850, 315), fill="#f5f2e8", width=8)
for (x, y), color in zip(centers, colors):
    d.ellipse((x - 58, y - 58, x + 58, y + 58), fill=color, outline="#f5f2e8", width=7)
    d.ellipse((x - 17, y - 17, x + 17, y + 17), fill="#181c19")

# Checklist marks: abstract geometry, not baked copy.
for y in (138, 492):
    d.rectangle((1010, y - 18, 1046, y + 18), outline="#f5f2e8", width=4)
    d.line((1018, y, 1028, y + 10, 1042, y - 10), fill="#55a97b", width=5)

img.save(out, format="PNG", optimize=True)
print(out)
