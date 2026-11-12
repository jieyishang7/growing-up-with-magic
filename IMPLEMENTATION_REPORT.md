# Implementation status — November 12, 2026

The existing DATA_REPORT.md and SOURCE_GUIDE.md were inspected, along with every raw table, Disney catalogue table, existing analysis modules/results and README. There was no existing website code. The full Master Prompt V2 was retrieved from the referenced chat. No pitch PDF or reference-image attachment was returned with that chat or found in this checkout; the first visual version follows the textual palette and geometry specification. The old report/analysis and raw snapshots remain unchanged.

## Actual coverage

| Layer | Coverage | Verification boundary |
| --- | --- | --- |
| Film master | 95/95: Disney Animation 64, Pixar 31 | Internal types, uniqueness, studio counts, source links and references checked. Original snapshot metadata has not all been independently reverified. |
| Themes | 10/95 films, partial | Official film pages read; original evidence paraphrases; pending human second review. |
| Story life stages | 8/95 films | Explicit ages or roles; source-linked, pending human second review. |
| Character relationships | 8/95 films | Explicit relationships, pending human second review. |
| IMDb ratings | 31/95 films | Preserved historical Pixar secondary snapshot; no IMDb IDs or observation dates. |
| Human-reviewed thematic films | 0/95 | No completed second review claimed. |
| Reviews / audience ages | 0 | No review corpus collected or scraped. |

The pilot includes Finding Nemo, Up, Frozen, Inside Out, Moana, Coco, Soul, Encanto, Luca and Turning Red. It is a purposive, recent-heavy pilot; use it to test the research workflow, not infer historical changes or studio differences. Theme membership is incomplete even for these films.

## Implemented

React + Vite + D3 SVG app, midnight/navy and fine violet/magenta geometry. Signature timeline keeps all 95 film IDs through a continuous reversible tunnel → radial disc → Jaccard stress landscape transition. Scroll and direct slider/navigation coexist. Unknown films are retained in an indexed shelf, outside similarity and contours. Date guides are explicitly distinguished from film observations.

Studio/decade/theme/life-stage filters, birth-year approximate release age and youth highlighting, selected-film persistence, evidence notebook, downloadable provenance bundle, 95 categorical radial fingerprints, two-film comparison, stage tree with expandable relationship lists, deterministic force-layout film/theme network with drag/zoom, IMDb rating timeline with vote-size encoding. Landscape supports pan/zoom. Reduced motion skips the morph animation. Responsive layout and keyboard controls are included.

## Pipeline

`analysis/build_atlas.py` produces `data/processed/films_master.csv`, `imdb_ratings.csv`, atlas JSON and SHA-256 validation manifest from the preserved snapshots and editable annotation CSVs. `analysis/import_imdb.py` accepts official local basics/ratings files, emits candidate IDs, requires a separately human-reviewed mapping and explicit rating snapshot date. It does not scrape IMDb pages or collect comments. No other rating platforms are included in generated application data.

## Validation

`npm test`: four automated tests cover evidence/foreign-key coverage, unknown-vs-zero treatment, Jaccard properties, deterministic coordinates, finite transforms at 17 morph positions, reversibility and IMDb-only app metrics. `npm run build`: successful production build. See final delivery note for browser checks; do not equate automated model tests with all-interaction browser coverage.

## Remaining

- Independently reconcile all 95 metadata records and match IMDb title IDs, then acquire/import an allowed official ratings snapshot for both studios.
- Extend annotations with the same rubric across decades and studios; complete human second review and disagreements log.
- Receive/locate original pitch PDF and image for a visual comparison pass.
- Improve landscape label collision, touch interactions, tooltip readability and richer stage-specific character organization as the dataset expands.
- No audience comments, viewer ages or longitudinal interpretation claims are supported.
