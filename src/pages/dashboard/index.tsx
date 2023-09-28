import { getTopTracks } from '@/utils/spotify/getTopTracks';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    getTopTracks(5);
  }, []);

  return (
    <main className="main">
      <p>Dashboard, logged in using spotify</p>
    </main>
  );
}
