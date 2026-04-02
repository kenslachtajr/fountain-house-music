'use client';

import { ArtistSummary } from '~/server/queries/artists/get-artists';
import { ArtistCard } from './artist-card';

interface ArtistsContentProps {
  artists: ArtistSummary[];
}

export function ArtistsContent({ artists }: ArtistsContentProps) {
  if (artists.length === 0) {
    return <div className="mt-4 text-neutral-400">No artists found.</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {artists.map((artist) => (
        <ArtistCard key={artist.name} artist={artist} />
      ))}
    </div>
  );
}
