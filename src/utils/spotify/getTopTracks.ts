import { fetchWebApi } from '@/utils/spotify/fetchApi';
import { RequestTopTracksResponse, Track } from '@/utils/spotify/spotifyApi';

const MAX_TOP_TRACKS_PER_REQUEST = 49;

export async function getTopTracks(numberOfTracks: number): Promise<Track[]> {
  const amountOfRequest = Math.ceil(numberOfTracks / MAX_TOP_TRACKS_PER_REQUEST);
  const amountForLastRequest = numberOfTracks % MAX_TOP_TRACKS_PER_REQUEST;

  const promises: Promise<RequestTopTracksResponse>[] = [];
  for (let i = 0; i < amountOfRequest; i++) {
    const offset = i * MAX_TOP_TRACKS_PER_REQUEST;

    let limit = MAX_TOP_TRACKS_PER_REQUEST;
    if (i + 1 === amountOfRequest && amountForLastRequest !== 0) {
      limit = amountForLastRequest;
    }

    promises.push(
      fetchWebApi(`v1/me/top/tracks?time_range=short_term&offset=${offset}&limit=${limit}`, 'GET')
    );
  }

  return (await Promise.all(promises)).reduce<Track[]>((carry, current) => {
    carry.push(...current.items);
    return carry;
  }, []);
}
