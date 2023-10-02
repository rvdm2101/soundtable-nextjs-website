import { getTopTracks } from '@/utils/spotify/getTopTracks';
import { useEffect } from 'react';
import BubbleChart from '@/components/Chart/BubbleChart';

export default function Dashboard() {
  useEffect(() => {
    getTopTracks(5);
  }, []);

  return (
    <main className="main">
      <p>Dashboard, logged in using spotify</p>
      <BubbleChart />
    </main>
  );
}
