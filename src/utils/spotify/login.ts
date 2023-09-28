import type { RequestAccessTokenResponse } from "@/utils/spotify/spotifyApi";

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(stringToEncode: string) {
    // @ts-ignore
    return btoa(String.fromCharCode.apply(null, new Uint8Array(stringToEncode)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  console.log(digest);

  // @ts-ignore
  return base64encode(digest);
}

// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
// Provides the user with a spotify login screen.
// After login, the user is redirected to SPOTIFY_REDIRECT_URI, with authorization info in the params (code and state)
export const userAuthorization = () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('userAuthorization: Missing clientId, redirectUri');
  }

  const codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read';

    localStorage.setItem('code_verifier', codeVerifier);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location.assign(`https://accounts.spotify.com/authorize?${args}`);
  });
};

// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token
// Request an access token from the spotify services. Save it to local storage on success
export async function requestAccessToken(authorizationCode: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!clientId || !redirectUri || !codeVerifier) {
    throw new Error('requestAccessToken: Missing clientId, redirectUri or codeVerifier');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const fetchResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.json() as Promise<RequestAccessTokenResponse>;
    })
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        return data;
      })
    .catch((error) => {
      console.error('Error:', error);
    });
  return fetchResponse?.access_token;
}

export const refreshAccessToken = () => {};
export const fetchUserProfile = () => {};
