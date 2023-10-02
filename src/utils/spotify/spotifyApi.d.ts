export type RequestAccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export type TrackArtist = {
  'external_urls': {
    'spotify': string
  },
  'href': string,
  'id': string,
  'name': string,
  'type': 'artist',
  'uri': string
};

export type TrackImage = {
  'height': number,
  'url': string,
  'width': number
};

export type Track = {
  'album': {
    'album_type': 'ALBUM',
    'artists': TrackArtist[],
    'available_markets': string[],
    'external_urls': {
      'spotify': string
    },
    'href': string,
    'id': string,
    'images': TrackImage[],
    'name': string,
    'release_date': string,
    'release_date_precision': 'day',
    'total_tracks': number,
    'type': 'album',
    'uri': string
  },
  'artists': TrackArtist[],
  'available_markets': string[],
  'disc_number': number,
  'duration_ms': number,
  'explicit': boolean,
  'external_ids': {
    'isrc': string
  },
  'external_urls': {
    'spotify': string
  },
  'href': string,
  'id': string,
  'is_local': boolean,
  'name': string,
  'popularity': number,
  'preview_url': string,
  'track_number': number,
  'type': 'track',
  'uri': string
};
