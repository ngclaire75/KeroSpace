"""Build source/output contact sheets for visual QA; never changes production assets."""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
parser = argparse.ArgumentParser()
parser.add_argument('batch')
args = parser.parse_args()
rows = json.loads(Path(args.batch).read_text())
font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 16)
for start in range(0, len(rows), 6):
    group = rows[start:start + 6]
    sheet = Image.new('RGB', (520, len(group) * 280), '#101015')
    draw = ImageDraw.Draw(sheet)
    for index, row in enumerate(group):
        draw.text((8, index * 280 + 4), row['name'] + ' | original / cutout', fill='white', font=font)
        for column, filename in enumerate([row['path'], str(Path(__file__).resolve().parents[1] / 'public/images/mlbb-cutouts' / f"hero-{row['id']}.webp") if (Path(__file__).resolve().parents[1] / 'public/images/mlbb-cutouts' / f"hero-{row['id']}.webp").exists() else row['generated']]):
            image = Image.open(filename).convert('RGBA')
            image.thumbnail((252, 252))
            x, y = column * 260 + 4, index * 280 + 26
            for cy in range(0, 252, 12):
                for cx in range(0, 252, 12):
                    draw.rectangle((x + cx, y + cy, x + cx + 11, y + cy + 11), fill='#22222a' if (cx // 12 + cy // 12) % 2 else '#393942')
            sheet.paste(image, (x + (252 - image.width) // 2, y + (252 - image.height) // 2), image)
    output = Path(args.batch).with_name(Path(args.batch).stem + f'-review-{start // 6 + 1}.jpg')
    sheet.save(output, quality=92)
    print(output)
