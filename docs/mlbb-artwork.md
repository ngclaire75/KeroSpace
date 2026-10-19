# MLBB original-art cutouts

Roster cards use the original hero poster portraits from the wiki and fill the card's image area with `object-fit: cover`. The cutout replacement is disabled.

The saved cutout assets below are retained for reference. They use original illustrations from the [official hero site](https://www.mobilelegends.com/en/hero), not hero display models. Per-hero source URLs and export methods are kept in `data/mlbbArtwork.json`. Files are stored in `public/images/mlbb-cutouts/`.

For official artwork that already contains a fully transparent background, its original alpha is preserved. Older opaque illustrations use a background-extraction mask produced with the built-in imagegen tool. The exporter applies that mask to the original source RGB pixels, discarding the generative tool's character rendering. This preserves the actual official colors and illustration details, including the original crop. Missing limbs or cropped portions are not reconstructed. Individual masks are refined where a first pass retains unrelated scenery or foreground objects.

The current public official hero source is the read-only content query used by the hero site: `POST https://api.gms.moontontech.com/api/gms/source/2669606/2756564` with `X-AppId: 2669606`, `X-ActId: 2669607`, `X-Lang: en` and a JSON body containing `pageIndex: 1` and `pageSize: 200`. Artwork is supplied as `data.painting` where present, otherwise `data.hero.data.painting`. Source illustrations are hosted on `akmweb.youngjoygame.com`.

## Background-extraction prompt set

Each character receives a separate built-in edit using its own official source illustration, with transparent background enabled. The prompt template is:

> Use case: background-extraction. This attached original official Mobile Legends {hero name} illustration is the edit target. Remove ONLY environmental scenery around the main hero. Keep original painted face, exact pose, visible body, hair, armor, clothing, wings if present, weapons and character magic unchanged. Preserve every visible detail, original colors and lighting, and square framing. Output genuinely transparent alpha. No redraw or redesign, no replacement models, no invented missing anatomy, no extended crop, no text, outline or shadow. Website hero cutout.

Where needed, the prompt also specifies keeping the character's companion, mount or armor: Popol and Kupa together, Barats and the dinosaur, Edith and her robot, Jawhead and the pilot, Floryn and her companion, Leomord and the horse, Irithel and her mount, Claude and Dexter, Chang'e and the rabbit/crescent, Pharsa and the white bird, and Vexana's summoned knight. Unrelated background figures are removed. Only the output alpha is used in the production export.

Some inputs use a flat alpha-matte request to avoid unnecessary illustration rendering:

> Use case: background-extraction / alpha-matte asset. From this official Mobile Legends {hero name} illustration, produce ONLY a flat white opaque silhouette of the existing character and their held items on a truly transparent background. Match the original subject's exact position, outline, shape, pose and square crop. The output is an alpha mask, not a new illustration: no interior colors, skin, anatomy details, lighting, textures, or lettering are needed. Remove all landscape, buildings, rocks, unrelated figures and scenery. Do not invent any hidden or cropped portions. Preserve original clothing silhouettes, hair and equipment, and the original mount/companion if present. This mask will be applied to the original untouched official image pixels for a website cutout.

## Export and verification

The exporter uses Sharp (installed outside the project with `npm install --prefix /tmp/mlbb-cutout-export --no-audit --no-fund sharp`). Set `MLBB_SHARP_ROOT` if using another temporary installation directory.

An input inventory contains each hero's `id`, `name`, official `source` URL and downloaded original `path`. Export using:

```sh
node scripts/save-mlbb-cutout.mjs inventory.json HERO_ID IMAGE_OR_MASK_PATH official-alpha
node scripts/save-mlbb-cutout.mjs inventory.json HERO_ID MASK_PATH background-removal
```

Use one mode per asset. Native alpha is exported unchanged; generated masks are resized to the original illustration dimensions. WebP exports are lossless. Visual QA compares each result with the official source on a checkerboard, using `scripts/preview-mlbb-cutouts.py` with a batch JSON list containing `id`, `name`, original `path` and generated mask path in `generated`.

```sh
python3 scripts/check-mlbb-cutouts.py --expected 133 --inventory inventory.json
```

The checker verifies coverage, official source host, matching filenames, alpha transparency, minimum dimensions and unchanged opaque source pixels. Without `--inventory`, source RGB comparison is skipped.
