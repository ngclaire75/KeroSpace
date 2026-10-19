# Character guides and build references

The guides interface contains released characters/heroes/battlesuits and their build recommendations across all six games. Each game hub has its original black selection card linking to a separate character roster at `/guides/[game]/characters`. Other category URLs and former general-guide URLs redirect to the relevant game hub. Those retired categories are no longer linked in navigation or the sitemap.

## Character roster

`/api/game-catalog?game=…&kind=characters` uses the configured game's MediaWiki API in `data/gameCatalogs.ts`. Search results must belong to that game's playable-character category. Browsing and search check release categories and lead-section release dates before returning results. Upcoming, unreleased and test-server entries are excluded; these checks depend on the accuracy of the source metadata. Only entries with their own artwork appear, and images that fail all delivery retries are removed from the visible roster.

The roster follows source continuation tokens, deduplicates entries and keeps a bounded category traversal. Source requests cache for 30 minutes. Images are shown with `object-fit: contain` in consistent frames. The restricted `/api/game-artwork` endpoint offers server delivery when direct thumbnail/original delivery fails.

## Build recommendations

`/api/character-build?game=…&title=…` first verifies a released playable character in the game's database, then requests a matching build from its provider. Recommendations are cached for one hour and are rendered inside `/guides/database`. Recommendations are source-backed opinions tied to equipment investment, role, team and version; no universal best-in-slot guarantee is made.

- **Honkai: Star Rail:** Prydwen character build data: ranked Light Cones, relic sets, planar ornaments, main stats and priorities.
- **Wuthering Waves:** Prydwen character build data: weapons, Echo sets, main Echo options and stats.
- **Neverness to Everness:** Prydwen character build data: Arcs, Cartridge sets and stats.
- **Genshin Impact:** KQM character quick/full guide tables: equipment names and main-stat choices. No guide narrative or reviews are republished.
- **Honkai Impact 3rd:** the Honkai Impact wiki's structured BBS equipment tables: recommended, universal and transitional weapon/stigmata configurations. Only factual equipment names and icons are extracted, not the source's narrative prose.
- **Mobile Legends:** the official `mapi.mobilelegends.com` hero API: recommended equipment in purchase order and named skill priorities. The official hero-name match is checked before accepting a result; its roster can lag the live game's newer heroes.

Prydwen's public Gatsby page data and rendered equipment tables are read from its canonical website, with its publicly exposed CloudFront distribution as a delivery fallback. Recommendation names, stat choices and refinement levels are rendered; review text, equipment descriptions, rotations and proprietary page layouts are not copied. The page credits the exact source and shows the source update when provided, separately from the retrieval date.

All six adapters were verified against real sample characters: Acheron, Arlecchino, White Comet, Jiyan, Nanally and Zilong. This is adapter verification, not a claim that every released character has a complete build in the connected source. Missing verified recommendations are shown explicitly rather than replaced with invented generic equipment. Temporarily unreachable providers are reported as unavailable.

Character artwork comes from the game's database; equipment artwork comes from the build provider's item records. Artwork belongs to the respective publishers and rights holders.

## Validation

- Production Nuxt build and whitespace checks.
- Live build responses for one character from each of the six providers.
- Fixture checks for equipment/stat extraction and exclusion of unrelated KQM teammate/rotation tables.
- Character-category checks, release/date filtering, default hero infobox selection, and image URL validation.
- Legacy category/general-guide redirects and character-only search responses.


## Team synergy

Character build responses include structured `teams`: team slots keep alternatives together rather than presenting every alternative as a required member. Prydwen team rows supply NTE and Wuthering Waves examples; Star Rail usage rows are explicitly labeled observed lineups, not ranked recommendations. KQM example-team captions supply Genshin lineups, preserving constellation qualifiers. Honkai Impact joint-skill requirements supply explicit named combinations. Mobile Legends uses the official hero response’s `counters.best` partner, verified against the requested hero name.

Each named teammate displays in a separate square-corner text card using the same outline as the Stats to build panel. Names stay on one line and truncate with an ellipsis when needed. Alternatives remain grouped within their team slot. KQM role-only templates are excluded, and composition headings come from the guide’s team section; unnamed compositions use their character lineup instead of “Example team”.

Every game also has a team structure and original planning tips. Missing character-specific lineups are identified explicitly. Provider review prose and rotation instructions are not imported. The team-requirements link opens the character’s original guide for conditional recommendations.

Genshin roster art prefers `Character <Name> Full Wish.png` with transparent portrait artwork as an alternative; Traveler variants have explicit aliases. Genshin entries without matching cutout artwork are omitted. Mobile Legends uses local transparent cutouts of original illustrations from the official hero website. Native alpha is kept where available; older illustrations use masks from the built-in imagegen background-extraction workflow, applied to their original source RGB pixels. The source URL and processing method are recorded per hero in `data/mlbbArtwork.json`. Background removal preserves the supplied crop; missing anatomy is not generated.

Run `node --experimental-strip-types scripts/check-team-synergy.mjs` for the six-game parser checks.
