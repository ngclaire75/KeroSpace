"""Create browser-sized WebP copies without changing the uploaded originals.
Run with Python 3 + Pillow: python3 scripts/optimize-images.py
Generated URLs contain a content hash, so they can be cached indefinitely.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote
from PIL import Image, ImageOps
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
DEST = PUBLIC / 'images/optimized'
DEST.mkdir(parents=True, exist_ok=True)
sources = set()
for folder in ['components', 'pages', 'data', 'assets']:
    for path in (ROOT / folder).rglob('*'):
        if path.suffix not in ['.vue', '.ts', '.css']:
            continue
        sources.update(unquote(s) for s in re.findall(r'/images/[^\n\'"`<>]*?\.(?:webp|png|jpe?g)', path.read_text(), re.I) if '${' not in s)
# These filenames are assembled dynamically in the Vue templates.
for pattern in ['images/games/*-logo.webp', 'images/community/youtube/*.jpg']:
    sources.update('/' + str(p.relative_to(PUBLIC)) for p in PUBLIC.glob(pattern))


def encode(src):
    path = PUBLIC / src.lstrip('/')
    if not path.is_file():
        return None
    data = path.read_bytes()
    digest = hashlib.sha256(data + b'kerospace-webp-v1').hexdigest()[:16]
    with Image.open(path) as original:
        if getattr(original, 'is_animated', False):
            return None
        image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
        width, height = image.size
        logo = '-logo.' in src or 'wordmark' in src
        tiny = logo or width <= 256 or '/avatars/' in src
        widths = [64, 128, 256, 480] if tiny else [320, 640, 960, 1440, 1920]
        if 'price-list' in src:
            widths = [640, 960, 1280, 1600, 1920, 2560]
        cap = min(width, widths[-1])
        widths = sorted(set([w for w in widths if w < cap] + [cap]))
        variants = []
        for w in widths:
            out = DEST / f'{digest}-{w}.webp'
            if not out.exists():
                resized = image.resize((w, max(1, round(height * w / width))), Image.Resampling.LANCZOS)
                resized.save(out, 'WEBP', quality=94 if 'price-list' in src else 88 if tiny else 84, method=6)
            variants.append({'width': w, 'src': '/images/optimized/' + out.name})
        fallback = next((v for v in reversed(variants) if v['width'] <= 1440), variants[0])
        return src, {'src': fallback['src'], 'width': width, 'height': height, 'variants': variants}, len(data), (DEST / Path(fallback['src']).name).stat().st_size

with ThreadPoolExecutor(max_workers=4) as pool:
    results = [r for r in pool.map(encode, sorted(sources)) if r]
manifest = {src: entry for src, entry, _, _ in results}
(ROOT / 'data/image-manifest.json').write_text(json.dumps(manifest, separators=(',', ':')) + '\n')
with Image.open(PUBLIC / 'favicon.webp') as icon:
    icon = ImageOps.exif_transpose(icon)
    icon.thumbnail((64, 64), Image.Resampling.LANCZOS)
    icon.save(PUBLIC / 'favicon-64.webp', 'WEBP', quality=90, method=6)
print(json.dumps({'images': len(results), 'originalBytes': sum(r[2] for r in results), 'fallbackBytes': sum(r[3] for r in results), 'variants': sum(len(r[1]['variants']) for r in results)}))
