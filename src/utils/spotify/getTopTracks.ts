import { fetchWebApi } from '@/utils/spotify/fetchApi';
import { Track } from '@/utils/spotify/spotifyApi';

export async function getTopTracks(numberOfTracks: number): Promise<Track[]> {
  const tracks = (await fetchWebApi(`v1/me/top/tracks?time_range=short_term&limit=${numberOfTracks}`, 'GET'));
  return tracks.items;
}
