# Responsive image assets

All page and component images use `AppImage`, which renders a normal `<img>` with
responsive WebP sources, asynchronous decoding and native lazy loading. Above-fold
navigation, Community hero artwork and the Home hero use eager loading. The Home
hero alone gets a responsive high-priority preload; other routes no longer fetch it.

Uploaded originals are preserved. Price-list links still open the full original.

## Updating an image

After adding or replacing artwork referenced by the site, run:

```sh
# Requires Python 3 and Pillow with WebP support.
npm run images:optimize
```

This regenerates `data/image-manifest.json` and creates hashed files in
`public/images/optimized`. Commit the manifest and its referenced variants together.
Unrecognised images and external URLs automatically use their original source.
The generation script includes dynamically named game logos and YouTube thumbnails.
Bump the encoding version in the script when changing its encoding settings.
Hashed image URLs use a one-year immutable cache; new source content creates new URLs.

Community Pulse and YouTube warm their current/next images when approaching the
viewport, plus tabs on hover/focus. Tab switches decode their responsive images
before showing them. The homepage streamer loads banners as needed and prepares
the next banner rather than loading every hidden slide immediately.

## Validation

The production build and all Vue components compile. Chrome checks covered all
three routes at 1440px (1×) and 390px (2×), scrolling each page and checking for
broken images, JavaScript errors and horizontal overflow. All six Pulse game tabs
and all 30 YouTube slides showed decoded responsive images. Cache headers were
checked on the production preview.

Initial image payload estimates for the same requested artwork, comparing the
original source bytes with the responsive candidates selected in the browser:

| Page | Desktop original → responsive | Mobile original → responsive |
| --- | --- | --- |
| Home | 6.59 MB → 0.50 MB | 5.79 MB → 0.40 MB |
| Community | 5.23 MB → 0.63 MB | 4.38 MB → 0.68 MB |
| Top Up | 1.24 MB → 0.32 MB | 0.90 MB → 0.41 MB |

These are image byte comparisons from local cold-cache checks, not timings or a
promise of download speed on a particular network. The favicon also fell from
992 KB to 1.1 KB. The initial optimisation generated 200 source images and 835 variants; rerunning the script reports the current totals.
