import { requestAccessToken } from '@/utils/spotify/login';

export async function fetchWebApi(endpoint: string, method: string, body: BodyInit | null = null) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  let accessToken = localStorage.getItem('access_token');
  if (code && (!accessToken || accessToken === 'undefined')) {
    accessToken = await requestAccessToken(code);
  }
  return fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method,
    body: body ? JSON.stringify(body) : null
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
