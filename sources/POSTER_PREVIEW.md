# Poster catalogue: 95 film references

Updated November 12, 2026. This supersedes the earlier five-film official-CDN layout preview.

`src/posters-data.json` contains one image reference for every film in the fixed 95-film master. `analysis/acquire_posters.py` matches exact normalized titles through the Wikipedia Disney Animation and Pixar film lists, checks each film page's release-year evidence, and extracts its portrait infobox image, caption and file-description URL. Source metadata is recorded per poster, with source hashes. No image bodies are downloaded or committed.

- 95 title/year matches, no missing poster references.
- 91 source captions explicitly say theatrical release poster (including regional/teaser variants). This is not a claim of 91 independently verified first-edition domestic posters.
- Four image editions remain flagged: Cinderella (1950 print advertisement), Luca (release poster), Soul (release poster), Turning Red (promotional release poster). Those descriptions do not establish original theatrical editions.
- Inside Out now uses the 2015 theatrical release poster: five emotions surrounded by multicolored dots, rather than the previous blue current Disney promotional cover. Its file and source page are linked in the notebook.

The saved manifest distinguishes source-caption checking from independent image-edition review. Do not claim all 95 original-release editions have been visually verified.

## Display and availability

All 95 films are listed below the main atlas. Only the 10 films with partial thematic coding receive a flower; missing coding does not create empty or invented theme glyphs. The notebook uses the same poster record. Portrait artwork is contained rather than cropped; image loads are lazy and failures display an explicit fallback.

The one-time HEAD check encountered Wikimedia rate limiting: 9 image responses were confirmed and subsequent responses returned HTTP 429. Results are preserved in `poster_link_checks.json`. The checker now stops immediately on 429. No rate-limit bypass or rapid retries are implemented. Browser spot checks can succeed independently of that batch request; complete 95-image browser-load verification is not claimed.

## Rights

Posters remain copyrighted by the respective rights holders. Wikipedia's article-text licence does not license non-free poster art. The UI links both the article and image file-description/rights page and provides holder attribution. External image references are used for the user's local layout preview; this is not an open-licence or blanket public-republication clearance. Review each file's terms before expanded hosting/reuse. Images have not been bundled in Git.

## Reproduce

Save the current Wikipedia Disney Animation and Pixar list HTML to `work/posters/wiki-disney.html` and `wiki-pixar.html`, then run `python3 analysis/acquire_posters.py`. Film-page caches remain ignored under work/. The existing manifest is preserved unless all 95 title/year/image checks pass. `npm test` validates complete master coverage, year evidence, source URLs and explicit edition states offline. The builder does not acquire IMDb data or change annotations.

The list presentation now flips from poster to a documented flower (10 annotated films) or a notes card (85 unannotated films). The original flower overlay frame is no longer used. Remote images and source links are unchanged by the flip effect.
