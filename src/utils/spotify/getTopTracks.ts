import {fetchWebApi} from "@/utils/spotify/fetchApi";

type TGetTopTracks = (numberOfTracks: number) => any;

export async function getTopTracks<TGetTopTracks>(numberOfTracks) {
    const tracks = (await fetchWebApi(
        `v1/me/top/tracks?time_range=short_term&limit=${numberOfTracks}`, 'GET'
    ));

    console.log(tracks);
    return tracks;
}
