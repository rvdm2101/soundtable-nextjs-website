import { getTopTracks } from '@/utils/spotify/getTopTracks';
import { useEffect, useState } from 'react';
import BubbleChart from '@/components/Chart/BubbleChart';
import type { BubbleChartData } from '@/components/Chart/BubbleChart';
import * as d3 from 'd3';

export default function Dashboard() {
  const [data, setData] = useState<BubbleChartData[]>([]);

  useEffect(() => {
    const height = 500;
    const width = 500;
    const radius = 6;
    const step = radius * 2;
    const theta = Math.PI * (3 - Math.sqrt(5));

    getTopTracks(50).then((tracks) => {
      setData(tracks.map((track, i) => {
        const updatedI = i + 0.5;
        const dataRadius = step * Math.sqrt(updatedI);
        const a = theta * updatedI;
        return {
          x: width / 2 + dataRadius * Math.cos(a),
          y: height / 2 + dataRadius * Math.sin(a),
          radius,
          color: d3.interpolateRainbow(i / 360),
          title: track.name,
        };
      }));
    });
  }, []);

  return (
    <main className="main">
      <p>Dashboard, logged in using spotify</p>
      <BubbleChart data={data} />
    </main>
  );
}
