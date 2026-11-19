import React from 'react';
import './AudienceRecords.css';

export function AudienceRecords({film}) {
  const primary=film.rating;
  const supplement=film.supplementary_rating;
  if(!primary&&!supplement)return null;
  return <details className="audience-records"><summary>IMDb audience records{supplement&&<span>Supplement pending verification</span>}</summary>
    <p>Audience ratings are separate from the film’s documented themes and life stages.</p>
    {primary&&<section><h3>Existing secondary snapshot</h3><div className="audience-value">{Number(primary.averageRating).toFixed(1)} <small>/ 10</small></div><p>{Number(primary.numVotes).toLocaleString('en-US')} recorded votes · Observation date unknown</p><a href={primary.source_url} target="_blank" rel="noreferrer">Snapshot source</a></section>}
    {supplement&&<section className="supplement-record"><h3>Imported worksheet entry</h3><div className="audience-value">{supplement.imdb_raw}<small> raw worksheet value</small></div><p><b>Unverified candidate: {supplement.candidate_averageRating?.toFixed(1)} / 10.</b> This assumes the raw value should be divided by ten. The file does not document its scale, upstream source, or rating observation date.</p><p>{supplement.source_file} · Row {supplement.source_row} · IMDb column<br/>Imported {supplement.snapshot_acquired}. Import date is not the rating date. IMDb title ID and vote count were not supplied.</p><p>This entry is not used in rating charts and does not replace the existing snapshot. Differences between snapshots cannot establish a change in audience opinion.</p></section>}
  </details>;
}
