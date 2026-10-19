"""Validate shipped MLBB cutouts, alpha channels, coverage and provenance."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from PIL import Image
parser = argparse.ArgumentParser()
parser.add_argument('--expected', type=int)
parser.add_argument('--inventory')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'data/mlbbArtwork.json').read_text())
if args.expected is not None:
    assert len(manifest) == args.expected, f'Expected {args.expected} heroes, found {len(manifest)}'
inventory = {str(row['id']): row for row in json.loads(Path(args.inventory).read_text())} if args.inventory else {}
for hero_id, item in manifest.items():
    assert item['image'] == f'/images/mlbb-cutouts/hero-{int(hero_id)}.webp'
    assert urlparse(item['source']).hostname == 'akmweb.youngjoygame.com'
    image = Image.open(root / 'public' / item['image'].lstrip('/')).convert('RGBA')
    assert min(image.size) >= 500, f"Image too small: {item['name']}"
    alpha = image.getchannel('A')
    assert alpha.getextrema() == (0, 255), f"Missing alpha: {item['name']}"
    assert alpha.histogram()[0] / (image.width * image.height) > .005, f"No background removed: {item['name']}"
    assert item['method'] in ['official-alpha', 'background-removal']
    assert item.get('originalPixels'), f"Original-pixel export missing: {item['name']}"
    if hero_id in inventory:
        import numpy as np
        source = np.asarray(Image.open(inventory[hero_id]['path']).convert('RGBA').convert('RGB'))
        output = np.asarray(image)
        visible = output[:, :, 3] > 0
        assert source.shape[:2] == output.shape[:2]
        assert np.array_equal(source[visible], output[:, :, :3][visible]), f"Character RGB changed: {item['name']}"
print(f'Validated {len(manifest)} transparent official-art cutouts.')
