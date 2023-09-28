import { fetchWebApi } from '@/utils/spotify/fetchApi';

export async function getTopTracks(numberOfTracks: number) {
  const tracks = (await fetchWebApi(`v1/me/top/tracks?time_range=short_term&limit=${numberOfTracks}`, 'GET'));

  console.log(tracks);
  return tracks;
}
