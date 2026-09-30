#!/usr/bin/env python3
"""Generate favicons, PWA icons and the Open Graph image for Employer Checker.

All shapes are defined once in a 512x512 coordinate space and rendered both
to SVG and (via Pillow, supersampled) to PNG/ICO, so every asset stays in sync.

Usage: python3 scripts/generate_assets.py
Requires: Pillow (pip install pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

BLUE = "#2563eb"
BLUE_DARK = "#1e40af"
WHITE = "#ffffff"
SLATE_900 = "#0f172a"
SLATE_600 = "#475569"
SLATE_50 = "#f8fafc"

# Geometry in a 512x512 space.
LENS_C, LENS_R, LENS_W = (224, 224), 124, 44
HANDLE = ((318, 318), (404, 404))
HANDLE_W = 60
CHECK = ((168, 226), (208, 266), (282, 188))
CHECK_W = 38
CORNER_R = 112
SS = 8  # supersampling factor

FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"


def svg_icon(maskable: bool = False) -> str:
    # Maskable icons must keep content inside the central 80% circle.
    transform = ' transform="translate(256 256) scale(0.72) translate(-256 -256)"' if maskable else ""
    bg = (
        f'<rect width="512" height="512" fill="{BLUE}"/>'
        if maskable
        else f'<rect width="512" height="512" rx="{CORNER_R}" fill="{BLUE}"/>'
    )
    (hx1, hy1), (hx2, hy2) = HANDLE
    pts = " ".join(f"{x},{y}" for x, y in CHECK)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
        f"{bg}"
        f'<g fill="none" stroke="{WHITE}" stroke-linecap="round" stroke-linejoin="round"{transform}>'
        f'<circle cx="{LENS_C[0]}" cy="{LENS_C[1]}" r="{LENS_R}" stroke-width="{LENS_W}"/>'
        f'<line x1="{hx1}" y1="{hy1}" x2="{hx2}" y2="{hy2}" stroke-width="{HANDLE_W}"/>'
        f'<polyline points="{pts}" stroke-width="{CHECK_W}"/>'
        "</g></svg>\n"
    )


def _round_line(draw, p1, p2, width, fill):
    draw.line([p1, p2], fill=fill, width=width)
    r = width / 2
    for x, y in (p1, p2):
        draw.ellipse([x - r, y - r, x + r, y + r], fill=fill)


def render_icon(size: int, maskable: bool = False, rounded: bool = True) -> Image.Image:
    big = 512 * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable or not rounded:
        d.rectangle([0, 0, big, big], fill=BLUE)
    else:
        d.rounded_rectangle([0, 0, big - 1, big - 1], radius=CORNER_R * SS, fill=BLUE)

    scale = 0.72 if maskable else 1.0

    def t(x, y):
        return ((256 + (x - 256) * scale) * SS, (256 + (y - 256) * scale) * SS)

    def w(v):
        return int(round(v * scale * SS))

    cx, cy = t(*LENS_C)
    r = LENS_R * scale * SS
    half = w(LENS_W) / 2
    d.ellipse([cx - r - half, cy - r - half, cx + r + half, cy + r + half], outline=WHITE, width=w(LENS_W))
    _round_line(d, t(*HANDLE[0]), t(*HANDLE[1]), w(HANDLE_W), WHITE)
    pts = [t(*p) for p in CHECK]
    for a, b in zip(pts, pts[1:]):
        _round_line(d, a, b, w(CHECK_W), WHITE)
    return img.resize((size, size), Image.LANCZOS)


def render_og() -> Image.Image:
    W, H = 1200, 630
    img = Image.new("RGB", (W * 2, H * 2), SLATE_50)
    d = ImageDraw.Draw(img)
    s = 2
    # Accent bar.
    d.rectangle([0, 0, W * s, 12 * s], fill=BLUE)

    icon = render_icon(220 * s)
    img.paste(icon, (90 * s, 110 * s), icon)

    title = ImageFont.truetype(FONT_BOLD, 80 * s)
    sub = ImageFont.truetype(FONT_REGULAR, 36 * s)
    chip_font = ImageFont.truetype(FONT_BOLD, 26 * s)
    url_font = ImageFont.truetype(FONT_REGULAR, 28 * s)

    x = 350 * s
    d.text((x, 118 * s), "Employer Checker", font=title, fill=SLATE_900)
    d.text((x, 228 * s), "Research a company before", font=sub, fill=SLATE_600)
    d.text((x, 276 * s), "you accept the offer", font=sub, fill=SLATE_600)

    chips = ["Registries", "Reviews", "Salaries", "Funding", "Engineering"]
    cx, cy = 90 * s, 400 * s
    pad_x, chip_h, gap = 26 * s, 60 * s, 16 * s
    for label in chips:
        tw = d.textlength(label, font=chip_font)
        cw = int(tw + pad_x * 2)
        if cx + cw > (W - 90) * s:
            cx, cy = 90 * s, cy + chip_h + gap
        d.rounded_rectangle([cx, cy, cx + cw, cy + chip_h], radius=chip_h // 2, fill="#dbeafe")
        d.text((cx + pad_x, cy + chip_h / 2), label, font=chip_font, fill=BLUE_DARK, anchor="lm")
        cx += cw + gap

    d.text((90 * s, 560 * s), "employer-checker.u8hub.com", font=url_font, fill=SLATE_600, anchor="lm")
    return img.resize((W, H), Image.LANCZOS)


def main():
    (PUBLIC / "favicon.svg").write_text(svg_icon())

    render_icon(180, rounded=False).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    render_icon(192).save(PUBLIC / "icon-192.png", optimize=True)
    render_icon(512).save(PUBLIC / "icon-512.png", optimize=True)
    render_icon(512, maskable=True).save(PUBLIC / "icon-512-maskable.png", optimize=True)

    ico_sizes = [16, 32, 48]
    render_icon(256).save(PUBLIC / "favicon.ico", format="ICO", sizes=[(n, n) for n in ico_sizes])

    render_og().save(PUBLIC / "og-image.png", optimize=True)
    print("Assets written to", PUBLIC)


if __name__ == "__main__":
    main()
