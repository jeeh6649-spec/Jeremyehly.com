#!/usr/bin/env python3
"""Build the JE favicon set from the licensed Gilroy ExtraBold source font."""

from pathlib import Path
import subprocess

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "assets/fonts/Gilroy-ExtraBold.otf"
ICON_DIR = ROOT / "assets/icons"
SVG_PATH = ICON_DIR / "favicon.svg"

CANVAS = 64
MAX_MARK_WIDTH = 49
MAX_MARK_HEIGHT = 43
GAP_CENTER_X = 31.5
INK = "#1A1A18"
WARM_WHITE = "#EDECEA"


def build_svg():
    font = TTFont(FONT_PATH)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    glyph_names = [cmap[ord(character)] for character in "JE"]

    positioned = []
    cursor = 0
    bounds = []
    for name in glyph_names:
        glyph = glyph_set[name]
        pen = BoundsPen(glyph_set)
        glyph.draw(pen)
        x_min, y_min, x_max, y_max = pen.bounds
        positioned.append((glyph, cursor))
        bounds.append((x_min + cursor, y_min, x_max + cursor, y_max))
        cursor += glyph.width

    x_min = min(bound[0] for bound in bounds)
    y_min = min(bound[1] for bound in bounds)
    x_max = max(bound[2] for bound in bounds)
    y_max = max(bound[3] for bound in bounds)
    mark_width = x_max - x_min
    mark_height = y_max - y_min
    scale = min(MAX_MARK_WIDTH / mark_width, MAX_MARK_HEIGHT / mark_height)

    gap_center = (bounds[0][2] + bounds[1][0]) / 2
    translate_x = GAP_CENTER_X - scale * gap_center
    translate_y = CANVAS / 2 + scale * (y_min + y_max) / 2

    path_pen = SVGPathPen(glyph_set)
    for glyph, x_offset in positioned:
        transform = Transform(
            scale,
            0,
            0,
            -scale,
            translate_x + scale * x_offset,
            translate_y,
        )
        glyph.draw(TransformPen(path_pen, transform))

    ICON_DIR.mkdir(parents=True, exist_ok=True)
    SVG_PATH.write_text(
        "\n".join(
            [
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
                "  <title>Jeremy Ehly</title>",
                f'  <rect width="64" height="64" fill="{INK}"/>',
                f'  <path fill="{WARM_WHITE}" d="{path_pen.getCommands()}"/>',
                "</svg>",
                "",
            ]
        ),
        encoding="utf-8",
    )


def rasterize():
    sizes = [16, 32, 48, 192, 512]
    for size in sizes:
        output = ICON_DIR / f"favicon-{size}x{size}.png"
        subprocess.run(
            [
                "magick",
                "-background",
                "none",
                "-density",
                "768",
                str(SVG_PATH),
                "-resize",
                f"{size}x{size}",
                str(output),
            ],
            check=True,
        )

    subprocess.run(
        [
            "magick",
            "-background",
            "none",
            "-density",
            "768",
            str(SVG_PATH),
            "-resize",
            "180x180",
            str(ROOT / "apple-touch-icon.png"),
        ],
        check=True,
    )
    subprocess.run(
        [
            "magick",
            str(ICON_DIR / "favicon-16x16.png"),
            str(ICON_DIR / "favicon-32x32.png"),
            str(ICON_DIR / "favicon-48x48.png"),
            str(ROOT / "favicon.ico"),
        ],
        check=True,
    )


if __name__ == "__main__":
    build_svg()
    rasterize()
