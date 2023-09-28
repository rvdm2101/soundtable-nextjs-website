import { useCallback } from 'react';
import { userAuthorization, requestAccessToken } from '@/utils/spotify/login';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const loginToSpotifyAndFetchAccessToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Go to dashboard, if the access token is already fetched
      router.push('/dashboard');
      return;
    }

    if (!!code && !accessToken) {
      requestAccessToken(code).then(() => {
        router.push('/dashboard');
      });
    }
  };

  if (typeof window !== 'undefined') {
    loginToSpotifyAndFetchAccessToken();
  }

  const requestSpotifyLogin = useCallback(() => {
    userAuthorization();
  }, []);

  return (
    <main className="main">
      <div className="description" />

      <div className="center">
        <button onClick={requestSpotifyLogin} style={{ zIndex: 1 }} type="button">Login with spotify</button>
      </div>

      <div className="grid" />
    </main>
  );
}
