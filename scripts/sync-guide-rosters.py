"""Refresh verified initial guide rosters and their artwork before deployment.

Run: python3 scripts/sync-guide-rosters.py https://kerospace.vercel.app
Catalogue failures leave snapshots untouched; artwork failures retain live URLs.
This is an explicit maintenance command, never a dependency of production builds.
"""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import sys
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000').rstrip('/')
GAMES = ['hsr', 'genshin', 'hi3', 'wuwa', 'nte', 'mlbb']


def download(url):
    with urlopen(Request(url, headers={'User-Agent': 'KeroSpace/1.0'}), timeout=60) as response:
        return response.read(), response.headers.get_content_type()


def catalogue(game):
    payload, _ = download(f'{BASE}/api/game-catalog?game={game}&kind=characters')
    result = json.loads(payload)
    if result.get('status') != 'available' or not result.get('items') or not result.get('checkedAt'):
        raise RuntimeError(f'{game}: catalogue unavailable; keeping previous snapshots')
    return game, result


def artwork(source):
    payload, content_type = download(source)
    extension = {'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/avif': 'avif'}.get(content_type)
    if not extension or not payload or len(payload) > 12 * 1024 * 1024:
        raise RuntimeError('Invalid artwork response')
    name = hashlib.sha256(payload).hexdigest()[:24] + '.' + extension
    return source, name, payload


def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        rosters = dict(pool.map(catalogue, GAMES))
    sources = sorted({entry['image'] for roster in rosters.values() for entry in roster['items'] if entry.get('image', '').startswith('https://static.wikia.nocookie.net/')})
    images = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for future in concurrent.futures.as_completed([pool.submit(artwork, source) for source in sources]):
            try:
                images.append(future.result())
            except Exception as error:
                print(f'Artwork not bundled (live fallback retained): {error}')
    destination = ROOT / 'public/images/guide-roster'
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for source, name, payload in images:
        (destination / name).write_bytes(payload)
        manifest[source] = f'/images/guide-roster/{name}'
    (ROOT / 'data/guideRosterSnapshots.json').write_text(json.dumps(rosters, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'data/guideArtwork.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Saved {len(rosters)} rosters and {len(images)} local images.')


if __name__ == '__main__':
    main()
