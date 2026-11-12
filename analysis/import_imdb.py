"""Permitted offline IMDb TSV import; no website scraping or review collection.
Candidates: python3 analysis/import_imdb.py --basics /path/title.basics.tsv.gz
After manual ID review: --ratings /path/title.ratings.tsv.gz --observed-at YYYY-MM-DD
The mapping must contain film_id,imdb_id,review_status=human_reviewed,source_url.
"""
import argparse,csv,gzip,re,hashlib,json
from datetime import date
from pathlib import Path
from build_atlas import ROOT,read,write

def norm(s):return re.sub('[^a-z0-9]','',s.lower())
def stream(path):
    with (gzip.open(path,'rt',encoding='utf-8') if str(path).endswith('.gz') else open(path,encoding='utf-8')) as f:
        yield from csv.DictReader(f,delimiter='\t')
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--basics');p.add_argument('--ratings');p.add_argument('--observed-at');a=p.parse_args()
    films=read('data/processed/films_master.csv')
    if a.basics:
        lookup={(norm(f['title']),f['year']):f for f in films};out=[]
        for r in stream(a.basics):
            if r['titleType']!='movie':continue
            for title in set([r['primaryTitle'],r['originalTitle']]):
                f=lookup.get((norm(title),r['startYear']))
                if f:out.append(dict(film_id=f['id'],imdb_id=r['tconst'],matched_title=title,year=r['startYear'],genres=r['genres'],review_status='candidate_pending_human',source_url='https://www.imdb.com/title/'+r['tconst']+'/'))
        if out:write('data/annotations/imdb_candidates.csv',out)
        print(f'{len(out)} candidates; titles and years alone do not verify identity. Review animation/studio manually.')
    if a.ratings:
        assert a.observed_at,'--observed-at is required';date.fromisoformat(a.observed_at)
        mapping=read('data/annotations/imdb_id_map.csv');assert mapping,'No reviewed mappings'
        assert all(r['review_status']=='human_reviewed' and r['source_url'] and re.fullmatch(r'tt\d+',r['imdb_id']) for r in mapping)
        assert len({r['film_id'] for r in mapping})==len(mapping)
        assert len({r['imdb_id'] for r in mapping})==len(mapping)
        ids={r['imdb_id']:r['film_id'] for r in mapping};out=[]
        for r in stream(a.ratings):
            if r['tconst'] in ids:
                assert 0<=float(r['averageRating'])<=10 and int(r['numVotes'])>=0
                out.append(dict(film_id=ids[r['tconst']],imdb_id=r['tconst'],averageRating=r['averageRating'],numVotes=r['numVotes'],observed_at=a.observed_at,snapshot_acquired=a.observed_at,source_url='https://datasets.imdbws.com/title.ratings.tsv.gz',review_status='official_dataset_reviewed_id'))
        assert len(out)==len(mapping),'Missing mapped ratings; inspect before replacing snapshot'
        write('data/annotations/imdb_ratings_verified.csv',out)
        (ROOT/'sources/imdb_import.json').write_text(json.dumps({'observed_at':a.observed_at,'rows':len(out),'ratings_sha256':hashlib.sha256(Path(a.ratings).read_bytes()).hexdigest(),'source':'https://datasets.imdbws.com/title.ratings.tsv.gz'},indent=2)+'\n')
        print(f'{len(out)} ratings imported; run npm run data')
if __name__=='__main__':main()
