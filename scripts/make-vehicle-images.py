"""Crops the client's vehicle photos to 16:9 and writes small WebP files to public/images/vehicles.
Usage: python3 scripts/make-vehicle-images.py /path/to/originals
Each photo: (source file, output name, focal x, focal y) -> 160, 560 and 1000 px wide versions.
mode 'fit' keeps a very wide photo whole on a blurred copy of itself. `blur` hides third-party signs."""
import sys
from PIL import Image, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = 'public/images/vehicles'
PHOTOS = [
    ('swift_1.jpeg', 'dzire-1', .5, .43, None, []),
    ('swift1_1.jpeg', 'dzire-2', .5, .53, None, []),
    ('crysta1_1.jpeg', 'crysta-1', .5, .69, None, []),
    ('crysta2_1.jpeg', 'crysta-2', .5, .66, None, []),
    ('ertiga.jpeg', 'crysta-3', .5, .38, None, []),
    ('hyrox1_1.jpeg', 'hycross-1', .5, .5, None, []),
    ('hyrox2_1.jpeg', 'hycross-2', .5, .44, None, []),
    ('urbania1_1.jpeg', 'urbania-1', .46, .5, None, []),
    ('urbania2_1.jpeg', 'urbania-2', .5, .5, 'fit', []),
    ('urbania3_1.jpeg', 'urbania-3', .5, .62, None, []),
    ('traveller2_1.jpeg', 'traveller-1', .5, .55, None, [(1280, 340, 1470, 460)]),
    ('traveller3_1.jpeg', 'traveller-2', .5, .55, None, []),
    ('traveller1_1.jpeg', 'traveller-3', .5, .5, None, []),
    ('monobus_27seater.jpeg', 'monobus-1', .5, .5, None, [(1335, 60, 1600, 300)]),
    ('27seater.jpeg', 'monobus-2', .5, .5, None, [(1480, 235, 1600, 360)]),
]
for src, name, fx, fy, mode, blur in PHOTOS:
    im = Image.open(f'{SRC}/{src}').convert('RGB')
    for box in blur:
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(22)), box[:2])
    W, H = im.size
    w = min(W, round(H * 16 / 9)); h = round(w * 9 / 16)
    x0 = max(0, min(W - w, round(fx * W - w / 2))); y0 = max(0, min(H - h, round(fy * H - h / 2)))
    cover = im.crop((x0, y0, x0 + w, y0 + h))
    if mode == 'fit':
        th = round(W * 9 / 16)
        bg = im.resize((W, th)).filter(ImageFilter.GaussianBlur(28))
        bg = Image.blend(bg, Image.new('RGB', bg.size, (36, 39, 44)), .35)
        bg.paste(im, (0, (th - H) // 2)); cover = bg
    for width, q in ((1000, 74), (560, 70), (160, 58)):
        cover.resize((width, round(width * 9 / 16)), Image.LANCZOS).save(f'{OUT}/{name}-{width}.webp', 'WEBP', quality=q, method=6)
print('done')
