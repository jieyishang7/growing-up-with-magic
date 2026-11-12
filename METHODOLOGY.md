# Growing Up with Magic — research protocol v1

Research question: How do Disney and Pixar films explore universal emotions across different stages of human life, and how has their representation evolved over time?

## Three clocks

Film Time = release year (Disney has year precision; Pixar snapshot has dates). Story Life = explicit character age or documented narrative role; films may participate in several stages. Viewer Time = calendar release year minus a visitor-supplied birth year. This is approximate age at release, not age at first viewing, rewatching or measured response.

## Annotation rules

Unit: positive film–theme or film–life-stage assignment. Missing assignments remain unknown. All pilot films are only partially coded; an absent theme must not be interpreted as a reviewed negative.

Every assignment stores film ID, source URL, section locator, original evidence paraphrase, rule ID, coder, date and review status. `source_checked_pending_human` means Codex read the cited source; it does not mean independent student review. `human_reviewed` requires an actual human second pass. No pilot assignments have that status. Sources are official Pixar/Disney film pages; the Up age is additionally supported by the preserved local Pixar plot snapshot. No Wiki-derived labels have been added. A future Wiki annotation must record its exact page and attribution/licence, and be flagged secondary.

Themes and inclusion rules (T-[theme]-v1):

- Friendship: explicit friends or sustained supportive companionship.
- Family: family relationships motivate the documented conflict or action; a generic Family genre is insufficient.
- Love: an explicitly documented romantic relationship motivates the story.
- Identity: self-definition, hidden identity or documented personal identity conflict.
- Belonging: inclusion/exclusion or adapting to a new community is central to the cited evidence.
- Independence: autonomy or exploration conflicts with documented dependence or parental constraints.
- Fear: fear/anxiety directly organizes documented action or appears as a personified emotion.
- Loss: documented bereavement or consequential separation, not merely a dangerous adventure.
- Purpose: an explicit life goal, vocation or reevaluation of life direction.
- Memory: remembering/forgetting explicitly shapes the narrative, not merely an older setting.

Life stages (L-age-or-explicit-role-v1): Childhood 0–12; Adolescence 13–19; Adulthood 20–64 or explicit adult parent/worker role; Later Life 65+ with evidence. Retirement alone should be flagged ambiguous unless corroborated (Up has age 78 in the source snapshot). Apply explicit fictional ages when available; do not infer ages from species, appearance, release dates or target audience. A stage describes a documented character experience and does not imply every character shares that age.

Relationships (R-explicit-relationship-v1): source character, target character and explicitly supported relationship. These are within-film character facts. Film–theme edges in Story Universe are project annotations, never character relationships. Plot evidence is paraphrased rather than reproduced wholesale.

## Similarity and geometry

`src/model.js`: Jaccard(A,B)=|A∩B|/|A∪B| for positive coded theme sets. Empty/unknown inputs return null. A deterministic stress layout uses sorted film IDs, fixed circular initial coordinates, 420 update iterations, target distance 40+300×(1−Jaccard), and no random coordinates. Both axes are arbitrary similarity coordinates. Density contours use D3 contourDensity, bandwidth 48 viewBox units, 20 thresholds. Contours reflect selected coded-film density, not emotional intensity, geography or an estimate of population prevalence. Partial coding can bias similarity. Current 10-film purposive pilot cannot support decade or studio prevalence claims.

Time geometry uses release year normalized over 1937–2026. Quarter-year elliptical guides are visual interpolation, not extra film observations. Film marks use stable IDs across all three positions. Uncoded films move to an indexed shelf in the landscape; they never receive invented theme coordinates. Gold marks are calendar ages 0–18 after the entered birth year. There is no inference about actual viewing.

## IMDb

The app uses only imdb_score and imdb_counts from the existing pixarfilms snapshot, mapped to averageRating and numVotes. These are historical secondary observations; observation dates and IMDb title IDs are absent. Acquisition October 29 is not an observation date. Excluded rating platforms remain only in untouched historical raw sources and reports, never app outputs.

`analysis/import_imdb.py` supports permitted official title.basics and title.ratings local TSV/gzip files. Candidate matching requires movie type, normalized title and exact year. Candidates are never accepted automatically. Review studio, title and animation identity, then save `data/annotations/imdb_id_map.csv` with film_id, imdb_id, source_url, review_status=human_reviewed. Import ratings with an explicit snapshot date, review unmatched rows, rerun the atlas builder. No downloader, website scraper or review-text collector is included. Official files are not claimed to have been acquired. Check IMDb non-commercial licence before expanded redistribution: https://data.imdb.com/non-commercial-datasets/ . Ratings and votes do not measure nostalgia, emotional depth or age-related response.

## Reproduce

`npm ci`, `npm run data`, `npm test`, `npm run build`, `npm run dev`.

Raw files and previous analyses are preserved. `analysis/build_atlas.py` checks counts, IDs, references, annotation evidence, allowed categories and rating ranges; it emits processed CSVs, a browser JSON bundle, coverage and input SHA-256 hashes. These are internal consistency checks, not independent verification of all 95 films. Source metadata snapshots remain labelled accordingly. Run old `analysis/analyze.py` separately if needed; it rewrites the historical report.
