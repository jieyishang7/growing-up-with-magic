"""Extract only movie identity and IMDb-labelled values from a local JMP file.

Requires jumpio (https://github.com/abardagjy/jumpio). No JMP scripts or
formulas are evaluated. The source binary stays outside the repository.
Example: PYTHONPATH=/path/to/jumpio/src python3 analysis/import_jmp_supplement.py
  --input /path/IDS_009.jmp --acquired-at 2026-11-19 --reader-commit <sha>

Scale is undocumented: raw IMDb values are retained; dividing by ten is a
candidate interpretation, never promoted to the primary ratings table.
"""
import argparse, csv, hashlib, json, re
from datetime import date
from pathlib import Path
from build_atlas import ROOT, read, write

SOURCE_ID='user-jmp-ids-009'
ALIASES={'frozenii':'frozen2'}
def norm(s): return re.sub(r'[^a-z0-9]','',s.lower())
def match_film(title,year,studio,films):
    title_key=norm(title); title_key=ALIASES.get(title_key,title_key)
    studio_key={'Disney':'Disney Animation','Pixar':'Pixar'}.get(studio)
    matches=[f for f in films if norm(f['title'])==title_key and int(f['year'])==int(year) and f['studio']==studio_key]
    if len(matches)!=1: raise ValueError(f'Unresolved movie identity: {title}, {year}, {studio}')
    return matches[0], 'explicit_title_alias_year_studio' if norm(title) in ALIASES else 'normalized_title_year_studio'

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input',required=True);parser.add_argument('--acquired-at',required=True);parser.add_argument('--reader-commit',required=True)
    args=parser.parse_args(); date.fromisoformat(args.acquired_at)
    assert re.fullmatch(r'[0-9a-f]{40}',args.reader_commit)
    import jumpio
    source=Path(args.input)
    table=jumpio.read_jmp(source,select=['Movie','Year','Studio','IMDb'])
    films=read('data/processed/films_master.csv');rows=[];seen=set()
    source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
    for i in range(len(table)):
        film,method=match_film(table['Movie'][i],table['Year'][i],table['Studio'][i],films)
        assert film['id'] not in seen;seen.add(film['id'])
        value=table['IMDb'][i]
        if value is not None and not 0<=float(value)<=100: raise ValueError('Out-of-range raw IMDb-labelled value')
        rows.append(dict(film_id=film['id'],source_movie=table['Movie'][i],source_year=table['Year'][i],source_studio=table['Studio'][i],imdb_raw='' if value is None else value,source_row=i+1,identity_match=method,source_id=SOURCE_ID,source_file=source.name,source_sha256=source_hash,snapshot_acquired=args.acquired_at))
    write('data/raw/user_jmp_imdb.csv',rows)
    manifest=dict(source_id=SOURCE_ID,source_file=source.name,source_sha256=source_hash,acquired_at=args.acquired_at,source_rows=len(table),extracted_rows=len(rows),selected_columns=['Movie','Year','Studio','IMDb'],upstream_source=None,observed_at=None,imdb_title_ids=None,vote_counts=None,source_scale=None,scale_interpretation='raw / 10 is an unconfirmed candidate; raw values remain authoritative to this file',review_status='user_supplied_unverified',reader=dict(repository='https://github.com/abardagjy/jumpio',commit=args.reader_commit,read_only=True),original_binary_redistributed=False,excluded_measures='All other worksheet columns are excluded from the atlas')
    (ROOT/'sources/user_jmp_import.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps({'rows':len(rows),'matched':len(seen),'primary_ratings_overwritten':0,'source_sha256':source_hash}))
if __name__=='__main__':main()
